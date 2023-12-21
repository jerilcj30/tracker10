package campaigns

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type CampaignsHandler struct {
	DB *sql.DB
}

type CampaignByIdRespose struct {
	Group1            string  `json:"Group1"`
	Group2            string  `json:"Group2" `
	Group3            string  `json:"Group3" `
	Sessions          string  `json:"Sessions"`
	Impressions       int     `json:"Impressions" validate:"required"`
	UniqueImpressions int     `json:"UniqueImpressions" validate:"required"`
	Conversions       int     `json:"Conversions" validate:"required"`
	TotalCost         int     `json:"TotalCost" validate:"required"`
	Revenue           float64 `json:"Revenue" validate:"required"`
	Profit            float64 `json:"Profit" validate:"required"`
	ROI               float64 `json:"ROI" validate:"required"`
	EPC               float64 `json:"EPC" validate:"required"`
}

// structure of the data requested from the client/browser
type Request struct {
	CampaignUUID           string `json:"CampaignUUID" validate:"required"`
	CampaignName           string `json:"CampaignName" validate:"required"`
	CampaignTrafficSource  int    `json:"CampaignTrafficSource" validate:"required"`
	CampaignCountry        string `json:"CampaignCountry" validate:"required"`
	CampaignTrackingDomain int    `json:"CampaignTrackingDomain" validate:"required"`
	CampaignFlow           int    `json:"CampaignFlow" validate:"required"`
	CampaignCPC            int    `json:"CampaignCPC" validate:"required"`
}

// structure of the data responded from the server
type Response struct {
	CampaignUUID              string  `json:"CampaignUUID" validate:"required"`
	CampaignName              string  `json:"CampaignName" validate:"required"`
	CampaignFlowID            string  `json:"CampaignFlowID" validate:"required"`
	CampaignTrafficSource     string  `json:"CampaignTrafficSource" validate:"required"`
	CampaignCountry           string  `json:"CampaignCountry" validate:"required"`
	CampaignCPC               int     `json:"CampaignCPC" validate:"required"`
	CampaignConversions       int     `json:"CampaignConversions" validate:"required"`
	CampaignImpressions       int     `json:"CampaignImpressions" validate:"required"`
	CampaignUniqueImpressions int     `json:"CampaignUniqueImpressions" validate:"required"`
	CampaignTotalCost         int     `json:"CampaignTotalCost" validate:"required"`
	CampaignRevenue           int     `json:"CampaignRevenue" validate:"required"`
	CampaignProfit            int     `json:"CampaignProfit" validate:"required"`
	CampaignROI               int     `json:"CampaignROI" validate:"required"`
	CampaignEPC               int     `json:"CampaignEPC" validate:"required"`
	CampaignDaysLapsed        float64 `json:"CampaignDaysLapsed" validate:"required"`
	CampaignHoursLapsed       float64 `json:"CampaignHoursLapsed" validate:"required"`
}

// GET Campaigns
// @tags Campaigns
// @Summary Generate the campaign url
// @Description Generate the campaign url
// @Accept  json
// @Produce  json
// @Param campaign_id query string true "ptKhRKgMdzt"
// @Success 200 {string} Response "campaign url"
// @Failure 400 {string} Response "Bad requesr"
// @Failure 500 {string} Response "Internal server error"
// @Router /campaigns/generatecampaignurl  [get]
func (b CampaignsHandler) GetCampaignURLHandler(w http.ResponseWriter, r *http.Request) {
	campaignID := r.URL.Query().Get("campaign_id")
	campaignURL, err := getCampaignURL(b.DB, campaignID)

	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(campaignURL)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

}

// GET Campaigns
// @tags Campaigns
// @Summary Get the traffic/hit details of a specific campaign
// @Description Get the traffic/hit details of a specific campaign
// @Accept  json
// @Produce  json
// @Param id path string true "Campaign ID"
// @Param from query string true "Start date (YYYY-MM-DD)" Format(yyyy-MM-dd)
// @Param to query string true "End date (YYYY-MM-DD)" Format(yyyy-MM-dd)
// @Success 200 {array} Response "List of hits"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /campaigns/{id}  [get]
func (b CampaignsHandler) GetHandler(w http.ResponseWriter, r *http.Request) {

	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")

	results, err := getCampaigns(b.DB, from, to)

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

// GET Campaigns
// @tags Campaigns
// @Summary Get the list of all campaigns
// @Description Get the list of all campaigns
// @Accept  json
// @Produce  json
// @Param from query string true "Start date (YYYY-MM-DD)" Format(yyyy-MM-dd)
// @Param to query string true "End date (YYYY-MM-DD)" Format(yyyy-MM-dd)
// @Success 200 {array} Response "List of campaigns"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /campaigns  [get]
func (b CampaignsHandler) GetByIdHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	fmt.Println("hello")
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")

	value1 := r.URL.Query().Get("value1")
	value2 := r.URL.Query().Get("value2")
	value3 := r.URL.Query().Get("value3")

	results, err := getCampaignByID(b.DB, id, from, to, value1, value2, value3)
	fmt.Println("results", results)
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

// POST Campaigns
// @tags Campaigns
// @Summary Create a campaign
// @Description Create a campaign
// @Accept  json
// @Produce  json
// @Param campaign body Request true "Campaign data"
// @Success 200 {string} Response "Campaign created successfully"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /campaigns  [post]
func (b CampaignsHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
	var data Request
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := postCampaigns(b.DB, data); err != nil { // Handle the error
		http.Error(w, "Failed to insert campaign", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}
