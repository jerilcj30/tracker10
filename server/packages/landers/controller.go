package landers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

type LandersHandler struct {
	DB *sql.DB
}

type Response struct {
	Id         int    `json:"Id" validate:"required"`
	LanderName string `json:"LanderName" validate:"required"`
}

type Request struct {
	LanderName string `json:"LanderName" validate:"required"`
	LanderURL  string `json:"LanderURL" validate:"required"`
}

// GET Landers
// @tags Landers
// @Summary Get the list of all lander ids
// @Description Get the list of all lander ids
// @Accept  json
// @Produce  json
// @Success 200 {array} Response "List of lander ids"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /landers/landerids  [get]
func (b LandersHandler) GetLanderIds(w http.ResponseWriter, r *http.Request) {
	results, err := getLanderIds(b.DB)

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

// POST Landers
// @tags Landers
// @Summary Create a lander
// @Description Create a lander
// @Accept  json
// @Produce  json
// @Param lander body Request true "lander data"
// @Success 200 {string} Response "lander created successfully"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /landers  [post]
func (b LandersHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
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
