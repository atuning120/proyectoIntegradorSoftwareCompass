package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/atuning120/proyectoIntegradorSoftwareCompass/internal/database"
	"github.com/atuning120/proyectoIntegradorSoftwareCompass/internal/graph"
)

const defaultPort = "8085"

func main() {
	client, err := database.ConnectToMongoDB()
	if err != nil {
		panic(err)
	}
	defer client.Disconnect(context.Background())

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
