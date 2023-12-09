package flows

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type FlowsHandler struct {
	DB *sql.DB
}

// structure of the data passed from the server
type Response struct {
	Id         int    `json:"Id" validate:"required"`
	FlowNodeId string `json:"FlowNodeId" validate:"required"`
}

// structure of the data recieved from the client
type Request struct {
	Name string `json:"name"`
	// key will always be string and value can be int, float etc
	Attributes map[string]interface{} `json:"attributes,omitempty"`
	Children   []Request              `json:"children,omitempty"`
}

// GET Flows
// @tags Flows
// @Summary Get the list of all flow ids
// @Description Get the list of all flow ids
// @Accept  json
// @Produce  json
// @Success 200 {array} Response "List of flow ids"
// @Failure 400 {string} Response "Bad requesr"
// @Failure 500 {string} Response "Internal server error"
// @Router /flows/flowids  [get]
func (b FlowsHandler) GetFlowids(w http.ResponseWriter, r *http.Request) {
	results, err := getFlowIds(b.DB)

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

// POST Flows
// @tags Flows
// @Summary Create a flow
// @Description Create a flow
// @Accept  json
// @Produce  json
// @Param flow body Request true "flow data"
// @Success 200 {string} Response "Flow created successfully"
// @Failure 400 {string} Response "Bad request"
// @Failure 500 {string} Response "Internal server error"
// @Router /flows  [post]
func (b FlowsHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
	var data Request
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := insertToDB(b.DB, data, 0); err != nil {
		http.Error(w, "Failed to insert campaign", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}
