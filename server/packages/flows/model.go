package flows

import (
	"database/sql"
	"log"
)

func getFlowIds(db *sql.DB) ([]Response, error) {
	var res Response
	var newResponse []Response
	rows, err := db.Query("select id, flow_node_id from flow where flow_node_parent=$1", 0)

	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&res.Id, &res.FlowNodeId)
		newResponse = append(newResponse, res)
	}

	return newResponse, nil
}

func insertToDB(db *sql.DB, data Request, parentNodeID int64) error {
	query := `
		INSERT into flow(
			flow_node_id,
			flow_node,
			flow_node_type,			
			flow_node_weight,			
			flow_node_parent)			
		VALUES ($1, $2, $3, $4, $5) RETURNING id
	`
	var lastInsertedID int64

	err := db.QueryRow(query,
		data.Name,
		data.Attributes["nodeName"],
		data.Attributes["nodeType"],
		data.Attributes["nodeWeight"], parentNodeID).Scan(&lastInsertedID)

	if err != nil {
		log.Println(err)
	}

	// Recursively insert child nodes
	for _, childNode := range data.Children {
		if err := insertToDB(db, childNode, lastInsertedID); err != nil {
			return err
		}
	}

	return nil
}
