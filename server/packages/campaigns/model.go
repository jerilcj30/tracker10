package campaigns

import (
	"database/sql"
	"fmt"
	"log"
)

func getCampaignURL(db *sql.DB, campaignID string) (string, error) {
	// http://localhost:4000/campaigns/generatecampaignurl?campaign_id=ptKhRKgMdzt
	var token string

	query := `
		SELECT traffic_source_param_name, traffic_source_param_query, traffic_source_param_token 
		FROM traffic_source_token 
		WHERE traffic_source_token_name = (
			SELECT 
				c.campaign_traffic_source		
			FROM
				campaign c
			JOIN
				traffic_source t ON c.campaign_traffic_source = t.id
			WHERE
				c.campaign_uuid = $1
		);
		`

	rows, err := db.Query(query, campaignID)
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()

	for rows.Next() {

		var param_name, param_query, param_token string

		if err := rows.Scan(&param_name, &param_query, &param_token); err != nil {
			log.Println(err)

		}

		// Append "&" before each parameter except the first one
		if token != "" {
			token += "&"
		}

		// Concatenate param_token and param_query to form the token
		token += param_token + "=" + param_query

		// Print or use the retrieved values as needed
		//fmt.Printf("Traffic Source Param Name: %s, Query: %s, Token: %s\n", param_name, param_query, param_token)

	}
	campaignURL := fmt.Sprintf("http://localhost:4000/hits?campaign_id=%s&%s", campaignID, token)

	return campaignURL, nil
}

func getCampaigns(db *sql.DB, from string, to string) ([]Response, error) {

	var res Response
	var newReponse []Response

	query := `
	SELECT
    c.campaign_uuid,
    c.campaign_name,
    t.traffic_source_name AS campaign_traffic_source,
    c.campaign_country,
    c.campaign_cpc AS cpc,
	(SELECT count(id) FROM conversion WHERE conversion_campaign_uuid = c.campaign_uuid) AS conversions,
    (SELECT COUNT(id) FROM hit WHERE hit_campaign_id = c.id) AS impressions,
    (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id) AS unique_impressions,	
	(SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id) AS total_cost,
	(SELECT (COUNT(id) * c.campaign_cpc) FROM conversion WHERE conversion_campaign_uuid = c.campaign_uuid) AS revenue,
	((SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id) - (SELECT (COUNT(id) * c.campaign_cpc) FROM conversion WHERE conversion_campaign_uuid = c.campaign_uuid)) AS profit,
	CASE
        WHEN (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id) = 0 THEN 0
        ELSE
            (((SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id) - (SELECT COUNT(id) * c.campaign_cpc FROM conversion WHERE conversion_campaign_uuid = c.campaign_uuid)) /
            (SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id)) * 100
    END AS roi,
	CASE
    	WHEN (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id) = 0 THEN 0
    	ELSE
        	(SELECT (COUNT(id) * c.campaign_cpc) FROM conversion WHERE conversion_campaign_uuid = c.campaign_uuid) / (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id)
	END AS epc,
	EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - c.created_at)) / 3600 AS hours_lapsed,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - c.created_at)) / 3600 / 24 AS days_lapsed	

FROM
    campaign c
JOIN
    traffic_source t ON c.campaign_traffic_source = t.id 
WHERE 
	c.created_date BETWEEN $1 AND $2 
LIMIT 10;
`

	rows, err := db.Query(query, from, to)
	if err != nil {
		log.Fatalln(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&res.CampaignUUID,
			&res.CampaignName,
			&res.CampaignTrafficSource,
			&res.CampaignCountry,
			&res.CampaignCPC,
			&res.CampaignConversions,
			&res.CampaignImpressions,
			&res.CampaignUniqueImpressions,
			&res.CampaignTotalCost,
			&res.CampaignRevenue,
			&res.CampaignProfit,
			&res.CampaignROI,
			&res.CampaignEPC,
			&res.CampaignHoursLapsed,
			&res.CampaignDaysLapsed,
		)

		if err != nil {
			return nil, err
		}

		// calculated fields

		newReponse = append(newReponse, res)

	}

	return newReponse, nil

}

func postCampaigns(db *sql.DB, data Request) error {

	query := `
		INSERT into campaign(
			campaign_uuid,
			campaign_name,
			campaign_traffic_source,			
			campaign_country,			
			campaign_tracking_domain,
			campaign_flow,			
			campaign_cpc)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
	`

	var lastInsertedID int64
	err := db.QueryRow(query,
		data.CampaignUUID,
		data.CampaignName,
		data.CampaignTrafficSource,
		data.CampaignCountry,
		data.CampaignTrackingDomain,
		data.CampaignFlow,
		data.CampaignCPC).Scan(&lastInsertedID)

	return err
}
