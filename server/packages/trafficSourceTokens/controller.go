package trafficsourcetokens

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type TrafficSourceTokensHandler struct {
	DB *sql.DB
}

// structure of the schema
type Token struct {
	TrafficSourceTokenName  string `json:"TrafficSourceTokenName" validate:"required"`
	TrafficSourceTokenParam string `json:"TrafficSourceTokenParam" validate:"required"`
	TrafficSourceTokenQuery string `json:"TrafficSourceTokenQuery" validate:"required"`
}

// Structure for the data passed from the client
type Request struct {
	TrafficSourceName int     `json:"TrafficSourceName" validate:"required"`
	Tokens            []Token `json:"Tokens" validate:"dive"`
}

// POST Trafficsourcetokens
// @tags Trafficsourcetokens
// @Summary Create a trafficsource token
// @Description Create a trafficsource token
// @Accept  json
// @Produce  json
// @Param trafficsourcetoken body Request true "trafficsource token data"
// @Success 200 {string} Response "Trafficsource token created successfully"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /trafficsourcetokens  [post]
func (b TrafficSourceTokensHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
	var data Request
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := insertToDB(b.DB, data); err != nil {
		http.Error(w, "Failed to create an offer", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}
