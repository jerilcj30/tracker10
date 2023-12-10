package trafficsourcetokens

import (
	"database/sql"
	"log"
)

func insertToDB(db *sql.DB, data Request) error {

	for _, schema := range data.Tokens {
		query := `
			INSERT INTO traffic_source_token(
				traffic_source_token_name,
				traffic_source_param_name,
				traffic_source_param_query,
				traffic_source_param_token
			) VALUES ($1, $2, $3, $4) RETURNING id
		`
		var lastInsertedID int64

		err := db.QueryRow(query,
			data.TrafficSourceName,
			schema.TrafficSourceTokenName,
			schema.TrafficSourceTokenQuery,
			schema.TrafficSourceTokenParam,
		).Scan(&lastInsertedID)

		if err != nil {
			// Handle the error, log it, etc.
			log.Println(err)
		}
	}
	return nil
}
