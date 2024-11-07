package connection

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectToMongoDB() (*mongo.Client, error) {
	// Configura la versión de la API estable en el cliente
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://diegomartinez:da280855@dev-cluster.ou83x.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster").SetServerAPIOptions(serverAPI)

	// Crea un nuevo cliente y conéctate al servidor
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		return nil, err // Devuelve el error si no se puede conectar
	}

	// Enviamos un ping para confirmar que la conexión fue exitosa
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		return nil, err // Devuelve el error si el ping falla
	}

	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
	return client, nil // Devuelve el cliente si todo está bien
}
