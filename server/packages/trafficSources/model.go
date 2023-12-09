package trafficsources

import (
	"database/sql"
	"log"
)

func getTrafficSourceids(db *sql.DB) ([]Response, error) {
	var res Response
	var newResponse []Response
	rows, err := db.Query("select id, traffic_source_name from traffic_source")
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&res.Id, &res.TrafficSourceName)
		newResponse = append(newResponse, res)
	}

	return newResponse, nil
}

func insertToDB(db *sql.DB, data Request) error {

	query := `
		INSERT into traffic_source(
			traffic_source_name)			
		VALUES ($1) RETURNING id
	`
	var lastInsertedID int64

	err := db.QueryRow(query, data.TrafficSourceName).Scan(&lastInsertedID)

	return err
}
