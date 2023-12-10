package hits

import (
	"context"
	"database/sql"
	"net/http"
)

type HitsHandler struct {
	DB *sql.DB
}

type FlowDetails struct {
	FlowNodeWeight int
	FlowNodeURL    string
}

func (b HitsHandler) GetHitsHandler(w http.ResponseWriter, r *http.Request) {
	/*
			1. hit url - http://localhost:4000/hits?campaign_id=bOuqmDLuYMh&{zone}=zone_id&{campaign}=campaign
		    2. Extract the campaign_id
			3. search for campaign_id and get the corresponding id
			4. insert to hit table
			5. insert to hit_query_string table

	*/

	// extract the campaign_id from the url
	campaignUuid := r.URL.Query().Get("campaign_id")

	// extract all the tokens from the url excluding campaign_id
	tokens := make(map[string]string)
	for key, value := range r.URL.Query() {
		if key != "campaign_id" {
			tokens[key] = value[0]
		}
	}

	err := insertToDB(context.Background(), b.DB, campaignUuid, tokens)

	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	result, err := processRedirection(b.DB, campaignUuid)

	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	selectedURL := weightedRandomSelection(result)

	http.Redirect(w, r, selectedURL, http.StatusFound)

}
