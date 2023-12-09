package affiliatenetworks

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

type AffiliateNetworksHandler struct {
	DB *sql.DB
}

// structure of the data passed from the server
type Response struct {
	Id                   int    `json:"Id" validate:"required"`
	AffiliateNetworkName string `json:"AffiliateNetworkName" validate:"required"`
}

// structure of the data recieved from the client
type Request struct {
	AffiliateNetworkName string `json:"AffiliateNetworkName" validate:"required"`
}

// GET Affiliatenetworks
// @tags Affiliate Networks
// @Summary Get the list of all affiliate network ids
// @Description Get the list of all affiliate network ids
// @Accept json
// @Produce json
// @Success 200 {array} Response "List of affiliate networks ids"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /affiliatenetworks/affiliatenetworkids [get]
func (b AffiliateNetworksHandler) GetAffiliateNetworkIds(w http.ResponseWriter, r *http.Request) {
	results, err := getAffiliateNetworkIds(b.DB)

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

// POST Affiliatenetworks
// @tags Affiliate Networks
// @Summary Create an affiliate network
// @Description Create an affiliate network
// @Accept  json
// @Produce  json
// @Param affiliateNetwork body Request true "affiliateNetwork data"
// @Success 200 {string} Response "affiliateNetwork created successfully"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /affiliatenetworks  [post]
func (b AffiliateNetworksHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
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
