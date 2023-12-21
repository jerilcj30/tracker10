// Handlers for the router yet to be implemented
package clicks

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type ClicksHandler struct {
	DB *sql.DB
}

/*
When a visitor visit this url - http://localhost:4000/clicks
insert hit details to hit table
insert node visit details to visit table
http://localhost:4000/clicks/?lp=yx30qvbw_ta - route to landing page with this id
http://localhost:4000/clicks/?op=ugrlx_7pprb - route to offer page with this id
http://localhost:4000/clicks/1  - parent is 1 and redirect to all children of 1
*/
func (b ClicksHandler) GetHandler(w http.ResponseWriter, r *http.Request) {

	books, err := listBooks(b.DB)

	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(books)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}

func (b ClicksHandler) GetByIdHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	book := getBook(id)
	if book == nil {
		http.Error(w, "Book not found", http.StatusNotFound)
	}
	err := json.NewEncoder(w).Encode(book)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}

func (b ClicksHandler) PostHandler(w http.ResponseWriter, r *http.Request) {
	var book Book
	err := json.NewDecoder(r.Body).Decode(&book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	storeBook(book)
	err = json.NewEncoder(w).Encode(book)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
}
