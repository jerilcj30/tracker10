package offers

import (
	"database/sql"
	"log"
)

func getOfferIds(db *sql.DB) ([]Response, error) {
	var res Response
	var newResponse []Response

	rows, err := db.Query("select id, offer_name from offer")

	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&res.Id, &res.OfferName)
		newResponse = append(newResponse, res)
	}

	return newResponse, nil
}

func insertToDB(db *sql.DB, data Request) error {
	query := `
		INSERT into offer(
			offer_name,
			offer_url,
			offer_affiliate_network,			
			offer_payout)			
		VALUES ($1, $2, $3, $4) RETURNING id
	`

	var lastInsertedID int64

	err := db.QueryRow(query,
		data.OfferName,
		data.OfferURL,
		data.OfferAffiliateNetwork,
		data.OfferPayout).Scan(&lastInsertedID)

	return err

}
