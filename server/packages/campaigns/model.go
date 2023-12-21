package campaigns

import (
	"database/sql"
	"fmt"
	"log"
)

func getCampaignByID(db *sql.DB,
	id string,
	from string,
	to string,
	value1 string,
	value2 string,
	value3 string) ([]CampaignByIdRespose, error) {
	var res CampaignByIdRespose
	var newReponse []CampaignByIdRespose

	fmt.Println(from)
	fmt.Println(to)
	fmt.Println(value1)
	fmt.Println(value2)
	fmt.Println(value3)

	query := `
	SELECT
		hit_session_id AS sessions,
		COUNT(hit_session_id) AS impressions,
		COUNT(DISTINCT hit_session_id) AS unique_impressions,
		COUNT(fk_hit_session_id) AS conversions,
		c.campaign_cpc * COUNT(DISTINCT hit_session_id) AS total_cost,
		COALESCE(COUNT(fk_hit_session_id) * SUM(conversion_value), 0) AS revenue,
		COALESCE(COUNT(fk_hit_session_id) * SUM(conversion_value) - (c.campaign_cpc * COUNT(DISTINCT hit_session_id)), 0) AS profit,
    CASE
        WHEN (c.campaign_cpc * COUNT(DISTINCT hit_session_id)) <> 0
        THEN COALESCE((COUNT(fk_hit_session_id) * SUM(conversion_value) - (c.campaign_cpc * COUNT(DISTINCT hit_session_id))) / (c.campaign_cpc * COUNT(DISTINCT hit_session_id)) * 100, 0)
        ELSE 0
    END AS ROI,
    	COALESCE(SUM(conversion_value) / NULLIF(COUNT(fk_hit_session_id), 0), 0) AS EPC
	FROM
		hit
	LEFT JOIN
		conversion conv ON hit.hit_session_id = conv.fk_hit_session_id
	JOIN
		campaign c ON hit.hit_campaign_id = c.id
	WHERE
		hit_campaign_id = (SELECT id FROM campaign WHERE campaign_uuid = $1)
	GROUP BY
		hit_session_id, campaign_cpc;
	`

	rows, err := db.Query(query, id)

	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(
			&res.Sessions,
			&res.Impressions,
			&res.UniqueImpressions,
			&res.Conversions,
			&res.TotalCost,
			&res.Revenue,
			&res.Profit,
			&res.ROI,
			&res.EPC)

		if err != nil {
			return nil, err
		}

		// append to slice
		newReponse = append(newReponse, res)
	}

	return newReponse, nil
}

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
	(SELECT flow_node_id FROM flow WHERE flow.id = c.campaign_flow) AS flow_node_id,
    t.traffic_source_name AS campaign_traffic_source,
    c.campaign_country,
    c.campaign_cpc AS cpc,
	(SELECT count(id) FROM conversion WHERE fk_campaign_id = c.id) AS conversions,
    (SELECT COUNT(id) FROM hit WHERE hit_campaign_id = c.id) AS impressions,
    (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id) AS unique_impressions,	
	(SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id) AS total_cost,
	(SELECT (COUNT(id) * c.campaign_cpc) FROM conversion WHERE fk_campaign_id = c.id) AS revenue,
	((SELECT (COUNT(id) * c.campaign_cpc) FROM conversion WHERE fk_campaign_id = c.id) - (SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id)) AS profit,
	CASE
        WHEN (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id) = 0 THEN 0
		WHEN (SELECT COUNT(id) FROM conversion WHERE fk_campaign_id = c.id) =0 THEN 0
        ELSE
            (((SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id) - (SELECT COUNT(id) * c.campaign_cpc FROM conversion WHERE fk_campaign_id = c.id)) /
            (SELECT COUNT(DISTINCT hit_session_id) * c.campaign_cpc FROM hit WHERE hit_campaign_id = c.id)) * 100
    END AS roi,
	CASE
    	WHEN (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id) = 0 THEN 0
    	ELSE
        	(SELECT (COUNT(id) * c.campaign_cpc) FROM conversion WHERE fk_campaign_id = c.id) / (SELECT COUNT(DISTINCT hit_session_id) FROM hit WHERE hit_campaign_id = c.id)
	END AS epc,
	ROUND(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - c.created_at)) / 3600, 2) AS hours_lapsed,
    ROUND(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - c.created_at)) / 3600 / 24, 2) AS days_lapsed	

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
			&res.CampaignFlowID,
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

		// append to slice
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
