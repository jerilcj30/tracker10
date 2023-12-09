postgres:
	docker run --name postgres15 -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:15-alpine

pgadmin:
	docker run --name pgadmin -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=jerilcj3@gmail.com -e PGADMIN_DEFAULT_PASSWORD=johnjose -d dpage/pgadmin4

createdb:
	docker exec -it postgres15 createdb --username=root --owner=root tracker2

dropdb:
	docker exec -it postgres15 dropdb tracker2

migratedown:
	migrate -path db/migration -database "postgresql://root:secret@localhost:5432/tracker2?sslmode=disable" -verbose down

server:
	go run main.go

docs:
	swag init

.PHONY: postgres pgadmin createdb dropdb migrateup migratedown server docs