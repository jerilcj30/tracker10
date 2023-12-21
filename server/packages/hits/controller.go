package hits

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
)

type HitsHandler struct {
	DB *sql.DB
}

type UserAgentDetails struct {
	BrowserName    string
	BrowserVersion string
	OS             string
	OSVersion      string
	Device         string
	IsMobile       bool
	IsTablet       bool
	IsDesktop      bool
	IsBot          bool
	URL            string // URL provided by the bot
}

type MaxmindGeoLocation struct {
	PostalCode string
	City       string
	State      string
	Country    string
	Continent  string
}

type FlowDetails struct {
	FlowNodeWeight int
	FlowNodeURL    string
	FlowNodeType   string
	FlowNodeID     int
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

	tokens, err := extractTokens(r.URL.Query())
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	cookie, err := getOrCreateUIDCookie(w, r)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	// referrer
	referrer := r.Referer()

	//useragent strings
	userAgentDetails, err := processUserAgent(r.UserAgent())
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	// maxmind geolocation
	geoDetails, err := getMaxmindGeoDetails(r.RemoteAddr)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	// select all the first children of flow
	flowChildren, err := processRedirection(b.DB, campaignUuid)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	// select a random child and it's url considering the weight of each child
	// this is the path which the weightedRandomSelection has randomly selected
	selectedPath := weightedRandomSelection(flowChildren)
	fmt.Println(selectedPath)

	// insert to db
	err = insertToDB(context.Background(),
		b.DB,
		campaignUuid,
		tokens,
		cookie,
		referrer,
		userAgentDetails,
		geoDetails,
		selectedPath)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	// initial redirect
	http.Redirect(w, r, selectedPath.FlowNodeURL+"?"+"cid="+cookie.Value+"&"+r.URL.RawQuery, http.StatusFound)

}
