// src/connection/connection.go

package db

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectToMongoDB() (*mongo.Client, error) {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

	opts := options.Client().
		ApplyURI("mongodb+srv://diegomartinez:da280855@dev-cluster.ou83x.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster").
		SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		return nil, fmt.Errorf("error al conectar con MongoDB: %v", err)
	}

	// Enviar un ping para confirmar la conexión
	err = client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err()
	if err != nil {
		return nil, fmt.Errorf("error al hacer ping a MongoDB: %v", err)
	}

	fmt.Println("Ping exitoso. ¡Conectado a MongoDB!")
	return client, nil

}
