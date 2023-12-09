package landers

import (
	"database/sql"
	"log"
)

func getLanderIds(db *sql.DB) ([]Response, error) {
	var res Response
	var newResponse []Response

	rows, err := db.Query("select id, lander_name from lander")
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&res.Id, &res.LanderName)
		newResponse = append(newResponse, res)
	}

	return newResponse, nil
}

func insertToDB(db *sql.DB, data Request) error {
	query := `
		INSERT into lander(
			lander_name,
			lander_url)			
		VALUES ($1, $2) RETURNING id
	`
	var lastInsertedID int64

	err := db.QueryRow(query,
		data.LanderName,
		data.LanderURL).Scan(&lastInsertedID)

	return err
}
