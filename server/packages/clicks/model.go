package clicks

import "database/sql"

type Book struct {
	ID               string `json:"id"`
	Title            string `json:"title"`
	Author           string `json:"author"`
	PublishedDate    string `json:"published_date"`
	OriginalLanguage string `json:"original_language"`
}

var books = []*Book{
	{
		ID:               "1",
		Title:            "7 habits of Highly Effective People",
		Author:           "Stephen Covey",
		PublishedDate:    "15/08/1989",
		OriginalLanguage: "English",
	},
}

func listBooks(db *sql.DB) ([]*Book, error) {
	return books, nil
}

func getBook(id string) *Book {
	for _, book := range books {
		if book.ID == id {
			return book
		}
	}
	return nil
}

func storeBook(book Book) {
	books = append(books, &book)
}
