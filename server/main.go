package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	httpSwagger "github.com/swaggo/http-swagger"

	affiliatenetworks "github.com/jerilcj30/tracker10/packages/affiliateNetworks"
	campaigns "github.com/jerilcj30/tracker10/packages/campaigns"
	demo "github.com/jerilcj30/tracker10/packages/demos"
	"github.com/jerilcj30/tracker10/packages/flows"
	"github.com/jerilcj30/tracker10/packages/landers"
	"github.com/jerilcj30/tracker10/packages/offers"
	trafficsourcetokens "github.com/jerilcj30/tracker10/packages/trafficSourceTokens"
	trafficsources "github.com/jerilcj30/tracker10/packages/trafficSources"
	"github.com/jerilcj30/tracker10/util"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/jerilcj30/tracker10/docs"
	_ "github.com/lib/pq"
)

// @title Affiliate tracker
// @version 1.0
// @description Api routes for Affiliate tracker
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:4000
// @BasePath /
func main() {

	// load from env files
	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatal("cannot load config:", err)
	}

	// Connect to database
	db, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Fatal(err)
	}

	// run db migration

	runDBMigration(config.MigrationURL, config.DBSource)

	r := chi.NewRouter()

	// logger
	r.Use(middleware.Logger)

	// Basic CORS

	r.Use(cors.Handler(cors.Options{
		//AllowedOrigins:   []string{"http://localhost:3000"}, // Use this to allow specific origin hosts
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Mount("/swagger", httpSwagger.WrapHandler)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	// Demo routes
	r.Mount("/demos", BookRoutes(db))

	// Campaigns routes
	r.Mount("/affiliatenetworks", AffiliateNetworkRoutes(db))

	// Campaigns routes
	r.Mount("/campaigns", CampaignsRoutes(db))

	// flows routes
	r.Mount("/flows", FlowsRoutes(db))

	// landers routes
	r.Mount("/landers", LandersRoutes(db))

	// offers routes
	r.Mount("/offers", OffersRoutes(db))

	// trafficsources routes
	r.Mount("/trafficsources", TrafficSourceRoutes(db))

	// trafficsourcetokens routes
	r.Mount("/trafficsourcetokens", TrafficSourceTokensRoutes(db))

	http.ListenAndServe(config.ServerAddress, r)

}

func CampaignsRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	campaignsHandler := campaigns.CampaignsHandler{
		DB: db,
	}

	r.Get("/", campaignsHandler.GetHandler)
	r.Get("/generatecampaignurl", campaignsHandler.GetCampaignURLHandler)
	r.Post("/", campaignsHandler.PostHandler)
	return r
}

func AffiliateNetworkRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	affiliateNetworksHandler := affiliatenetworks.AffiliateNetworksHandler{
		DB: db,
	}

	r.Get("/affiliatenetworkids", affiliateNetworksHandler.GetAffiliateNetworkIds)
	r.Post("/", affiliateNetworksHandler.PostHandler)
	return r
}

func FlowsRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	flowsHandler := flows.FlowsHandler{
		DB: db,
	}

	r.Get("/flowids", flowsHandler.GetFlowids)
	r.Post("/", flowsHandler.PostHandler)
	return r
}

func LandersRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	landersHandler := landers.LandersHandler{
		DB: db,
	}

	r.Get("/landerids", landersHandler.GetLanderIds)
	r.Post("/", landersHandler.PostHandler)

	return r
}

func OffersRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	offersHandler := offers.OffersHandler{
		DB: db,
	}

	r.Get("/offerids", offersHandler.GetOfferIds)
	r.Post("/", offersHandler.PostHandler)

	return r
}

func TrafficSourceRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	trafficSourcesHandler := trafficsources.TrafficSourcesHandler{
		DB: db,
	}

	r.Get("/trafficsourceids", trafficSourcesHandler.GetTrafficSourceIds)
	r.Post("/", trafficSourcesHandler.PostHandler)
	return r
}

func TrafficSourceTokensRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	trafficSourceTokensHandler := trafficsourcetokens.TrafficSourceTokensHandler{
		DB: db,
	}

	r.Post("/", trafficSourceTokensHandler.PostHandler)
	return r
}

func BookRoutes(db *sql.DB) chi.Router {
	r := chi.NewRouter()

	bookHandler := demo.BookHandler{
		DB: db,
	}

	r.Get("/", bookHandler.GetHandler)
	r.Post("/", bookHandler.PostHandler)
	r.Get("/{id}", bookHandler.GetByIdHandler)
	r.Put("/{id}", bookHandler.PutHandler)
	r.Delete("/{id}", bookHandler.DeleteHandler)
	return r
}

func runDBMigration(migrationURL string, dbSource string) {
	migration, err := migrate.New(migrationURL, dbSource)
	if err != nil {
		log.Fatal("Cannot create a new migrate instance:", err)
		return
	}
	if err = migration.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal("Failed to run migrate up:", err)
		return
	}

	log.Println(("db migrated successfully"))
}
