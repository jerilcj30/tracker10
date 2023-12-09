package affiliatenetworks

import (
	"database/sql"
	"log"
)

func getAffiliateNetworkIds(db *sql.DB) ([]Response, error) {
	var res Response
	var newResponse []Response

	rows, err := db.Query("select id, affiliate_network_name from affiliate_network")
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&res.Id, &res.AffiliateNetworkName)
		newResponse = append(newResponse, res)
	}

	return newResponse, nil
}

func insertToDB(db *sql.DB, data Request) error {

	query := `
		INSERT into affiliate_network(
			affiliate_network_name)			
		VALUES ($1) RETURNING id
	`

	var lastInsertedID int64

	err := db.QueryRow(query,
		data.AffiliateNetworkName).Scan(&lastInsertedID)

	return err
}
