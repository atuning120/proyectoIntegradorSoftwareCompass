package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/consumer"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/graph"

	"github.com/rs/cors"
)

const defaultPort = "8081"

func main() {

	// Consumidores escuchando
	consumer.ProductoConsumidores()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Crear el servidor GraphQL
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// Habilitar CORS para permitir solicitudes del frontend (localhost:3000)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Origen permitido (puedes agregar más)
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		Debug:            true, // Activa para ver detalles en la consola
	})

	// Manejar las rutas de GraphQL y playground
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", c.Handler(srv)) // Aplicar el middleware de CORS al servidor GraphQL

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
