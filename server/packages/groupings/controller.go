// Handlers for the router yet to be implemented
package groupings

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type GroupingsHandler struct {
	DB *sql.DB
}

type Response struct {
	ID        string `json:"ID" validate:"required"`
	Groupings string `json:"Groupings" validate:"required"`
}

func (b GroupingsHandler) GetHandler(w http.ResponseWriter, r *http.Request) {

	campaignID := r.URL.Query().Get("id")
	results, err := getGroupings(b.DB, campaignID)

	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(results)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}
