package groupings

import (
	"database/sql"
	"log"
)

func getGroupings(db *sql.DB, campaignID string) ([]Response, error) {
	var res Response
	var newReponse []Response

	query := `
	WITH metric_data AS (
		SELECT
			DISTINCT column_name AS groupings
		FROM
			information_schema.columns
		WHERE
			table_name = 'metric'
			AND column_name NOT IN ('id', 'created_at', 'fk_campaign_id', 'fk_hit_id') -- Exclude 'id', 'created_date', and 'created_at' columns
	), hit_query_string_data AS (
		SELECT
			DISTINCT CONCAT('Token: ', hit_query_string_key) AS groupings
		FROM
			hit_query_string
		WHERE
			campaign_id = (SELECT id FROM campaign WHERE campaign_uuid = $1)
	)
	SELECT
		groupings,
		ROW_NUMBER() OVER (ORDER BY groupings) - 1 AS id_serial
	FROM
		(
			SELECT groupings FROM metric_data
			UNION
			SELECT groupings FROM hit_query_string_data
		) final_data
	ORDER BY
		groupings;
	`
	rows, err := db.Query(query, campaignID)
	if err != nil {
		log.Fatalln(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&res.Groupings,
			&res.ID)

		if err != nil {
			return nil, err
		}

		// append to slice
		newReponse = append(newReponse, res)

	}
	return newReponse, nil

}
