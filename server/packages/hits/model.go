package hits

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"net"
	"net/http"
	"path/filepath"
	"time"

	"github.com/mileusna/useragent"

	"github.com/oschwald/geoip2-golang"
)

func getOrCreateUIDCookie(w http.ResponseWriter, r *http.Request) (*http.Cookie, error) {

	// Retrieve 'uid' cookie from the incoming request
	cookie, err := r.Cookie("uid")
	if err == nil {
		// If 'uid' cookie exists, return it
		return cookie, nil
	}

	// If 'uid' cookie doesn't exist, generate a new UID
	uid := "uid" + time.Now().UTC().Format("20060102150405")

	// Create and set the 'uid' cookie in the response
	cookie = &http.Cookie{
		Name:  "uid",
		Value: uid,
	}

	http.SetCookie(w, cookie)

	return cookie, nil
}

func processUserAgent(UA string) (UserAgentDetails, error) {

	var userAgentDetails UserAgentDetails

	ua := useragent.Parse(UA)
	userAgentDetails.BrowserName = ua.Name
	userAgentDetails.BrowserVersion = ua.Version
	userAgentDetails.OS = ua.OS
	userAgentDetails.OSVersion = ua.OSVersion
	userAgentDetails.Device = ua.Device
	userAgentDetails.IsMobile = ua.Mobile
	userAgentDetails.IsTablet = ua.Tablet
	userAgentDetails.IsDesktop = ua.Desktop
	userAgentDetails.IsBot = ua.Bot
	userAgentDetails.URL = ua.URL

	return userAgentDetails, nil
}

func getMaxmindGeoDetails(realIP string) (MaxmindGeoLocation, error) {

	var geolocation MaxmindGeoLocation

	// Get the absolute path to the GeoIP2-City.mmdb file
	absPath, err := filepath.Abs("./util/GeoLite2-City.mmdb")
	if err != nil {
		log.Fatal(err)
	}

	db, err := geoip2.Open(absPath)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	ip := net.ParseIP("59.89.244.168")
	record, err := db.City(ip)
	if err != nil {
		log.Fatal(err)
	}

	geolocation.PostalCode = record.Postal.Code
	geolocation.City = record.City.Names["en"]
	geolocation.State = record.Subdivisions[0].Names["en"]
	geolocation.Country = record.Country.Names["en"]
	geolocation.Continent = record.Continent.Names["en"]

	return geolocation, nil
}

func weightedRandomSelection(flowDetailsList []FlowDetails) string {
	// Calculate the total weight
	totalWeight := 0
	for _, flow := range flowDetailsList {
		totalWeight += flow.FlowNodeWeight
	}

	// Generate a random number between 0 and totalWeight
	randomNumber := rand.Intn(totalWeight)

	// Iterate through the flowDetailsList to find the selected FlowNodeURL
	currentWeight := 0
	for _, flow := range flowDetailsList {
		currentWeight += flow.FlowNodeWeight
		if randomNumber < currentWeight {
			return flow.FlowNodeURL
		}
	}

	// This should not happen if the totalWeight is correctly calculated
	return ""
}

func processRedirection(db *sql.DB, campaignUuid string) ([]FlowDetails, error) {

	var flowDetailsArray []FlowDetails

	query1 := `
		SELECT    
		flow.flow_node_weight,
		CASE
			WHEN flow.flow_node_type = 'lander' THEN lander.lander_url
			WHEN flow.flow_node_type = 'offer' THEN offer.offer_url
		END AS url
		FROM
			flow
		LEFT JOIN
			lander ON flow.flow_node = lander.id
		LEFT JOIN
			offer ON flow.flow_node = offer.id
		WHERE
			flow.flow_node_parent = (SELECT campaign_flow FROM campaign WHERE campaign_uuid = $1);
	`

	rows, err := db.Query(query1, campaignUuid)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var flowDetails FlowDetails

	for rows.Next() {
		err := rows.Scan(&flowDetails.FlowNodeWeight, &flowDetails.FlowNodeURL)
		if err != nil {
			log.Fatal(err)
		}
		flowDetailsArray = append(flowDetailsArray, flowDetails)
	}

	return flowDetailsArray, err

}

func extractTokens(inputTokens map[string][]string) (map[string]string, error) {
	result := make(map[string]string)
	for key, value := range inputTokens {
		if key != "campaign_id" {
			result[key] = value[0]
		}
	}

	return result, nil
}

func insertToDB(c context.Context,
	db *sql.DB,
	campaignUuid string,
	tokens map[string]string,
	cookie *http.Cookie,
	referrer string,
	userAgentDetails UserAgentDetails,
	geoDetails MaxmindGeoLocation) error {

	query1 := `
		SELECT id FROM campaign WHERE campaign_uuid = $1
	`

	query2 := `
		INSERT into hit(
			hit_campaign_id,
			hit_session_id) VALUES ($1, $2) RETURNING id	
	`

	query3 := `
		INSERT into hit_query_string(
			hit_id,
			hit_query_string_key,
			hit_query_string_value) VALUES ($1, $2, $3) RETURNING id
		`

	query4 := `
			INSERT into metric(
				metrics_hit_id,
				metrics_campaign_id,
				referrer,
				browser_name,
				browser_version,
				os,
				os_version,
				device,
				is_mobile,
				is_tablet,
				is_desktop,
				is_bot,
				url,
				postal_code,
				city,
				state,
				country,
				continent) VALUES ($1, $2, $3, $4, $5, $6, $7,
					$8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id
		`

	// transaction
	ctx := context.Background()
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	// first transaction - get the id of the campaign
	var campaignId int
	err = tx.QueryRowContext(ctx, query1, campaignUuid).Scan(&campaignId)

	if err != nil {
		// Incase we find any error in the query execution, rollback the transaction
		tx.Rollback()
		fmt.Println("Error getting rows affected:", err)
		return nil
	}

	// second transaction - insert into hit table
	var hitId int
	err = tx.QueryRowContext(ctx, query2, campaignId, cookie.Value).Scan(&hitId)
	if err != nil {
		log.Fatal(err)
		return err
	}

	// third transaction - insert into hit_query_table

	for key, values := range tokens {
		_, err = tx.ExecContext(ctx, query3, hitId, key, values)

	}

	if err != nil {
		log.Fatal(err)
		return err
	}

	fmt.Println(referrer)

	// fourth transaction - insert into metric table
	var metricId int
	err = tx.QueryRowContext(
		ctx,
		query4,
		hitId,
		campaignId,
		referrer,
		userAgentDetails.BrowserName,
		userAgentDetails.BrowserVersion,
		userAgentDetails.OS,
		userAgentDetails.OSVersion,
		userAgentDetails.Device,
		userAgentDetails.IsMobile,
		userAgentDetails.IsTablet,
		userAgentDetails.IsDesktop,
		userAgentDetails.IsBot,
		userAgentDetails.URL,
		geoDetails.PostalCode,
		geoDetails.City,
		geoDetails.State,
		geoDetails.Country,
		geoDetails.Continent).Scan(&metricId)
	if err != nil {
		log.Fatal(err)
		return err
	}

	// Commit the transaction if there are no errors
	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
		return err
	}
	return err
}
