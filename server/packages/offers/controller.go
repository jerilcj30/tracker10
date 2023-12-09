package offers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type Response struct {
	Id        int    `json:"Id" validate:"required"`
	OfferName string `json:"OfferName" validate:"required"`
}

// structure of the data passed from the client
type Request struct {
	OfferName             string `json:"OfferName" validate:"required"`
	OfferURL              string `json:"OfferURL" validate:"required"`
	OfferAffiliateNetwork int    `json:"OfferAffiliateNetwork" validate:"required"`
	OfferPayout           int    `json:"OfferPayout" validate:"required"`
}

type OffersHandler struct {
	DB *sql.DB
}

// GET Offers
// @tags Offers
// @Summary Get the list of all offer ids
// @Description Get the list of all offer ids
// @Accept  json
// @Produce  json
// @Success 200 {array} Response "List of offer ids"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /offers/offerids  [get]
func (b OffersHandler) GetOfferIds(w http.ResponseWriter, r *http.Request) {

	results, err := getOfferIds(b.DB)

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

// POST Offers
// @tags Offers
// @Summary Create an offer
// @Description Create an offer
// @Accept  json
// @Produce  json
// @Param offer body Request true "offer data"
// @Success 200 {string} Response "Offer created successfully"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /offers  [post]
func (b OffersHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
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
