package hits

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
)

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

func insertToDB(c context.Context, db *sql.DB, campaignUuid string, tokens map[string]string) error {

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
	err = tx.QueryRowContext(ctx, query2, campaignId, "121212112").Scan(&hitId)
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

	// Commit the transaction if there are no errors
	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
		return err
	}

	return err
}
