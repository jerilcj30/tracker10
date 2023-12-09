package trafficsources

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

type TrafficSourcesHandler struct {
	DB *sql.DB
}

type Response struct {
	Id                int    `json:"Id" validate:"required"`
	TrafficSourceName string `json:"TrafficSourceName" validate:"required"`
}

// structure of the data passed from the client
type Request struct {
	TrafficSourceName string `json:"TrafficSourceName" validate:"required"`
}

// GET Trafficsources
// @tags Trafficsources
// @Summary Get the list of all trafficsource ids
// @Description Get the list of all trafficsource ids
// @Accept  json
// @Produce  json
// @Success 200 {array} Response "List of trafficsource ids"
// @Failure 400 {string} Response "Bad requesr"
// @Failure 500 {string} Response "Internal server error"
// @Router /trafficsources/trafficsourceids  [get]
func (b TrafficSourcesHandler) GetTrafficSourceIds(w http.ResponseWriter, r *http.Request) {
	results, err := getTrafficSourceids(b.DB)

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

// POST Trafficsources
// @tags Trafficsources
// @Summary Create a trafficsource
// @Description Create a trafficsource
// @Accept  json
// @Produce  json
// @Param trafficsource body Request true "trafficsource data"
// @Success 200 {string} Response "Trafficsource created successfully"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /trafficsources  [post]
func (b TrafficSourcesHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
	var data Request
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := insertToDB(b.DB, data); err != nil {
		log.Println(err)
	}
	err = json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}
