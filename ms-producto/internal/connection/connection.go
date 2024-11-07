package connection

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var clientInstance *mongo.Client
var clientInstanceError error
var mongoOnce = false

// Conectar a la base de datos MongoDB
func ConnectToMongoDB() (*mongo.Client, error) {
	// Usa el patrón Singleton para evitar múltiples conexiones
	if clientInstance == nil && !mongoOnce {
		serverAPI := options.ServerAPI(options.ServerAPIVersion1)

		opts := options.Client().
			ApplyURI("mongodb+srv://diegomartinez:da280855@dev-cluster.ou83x.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster").
			SetServerAPIOptions(serverAPI)

		client, err := mongo.Connect(context.TODO(), opts)
		if err != nil {
			clientInstanceError = fmt.Errorf("error al conectar con MongoDB: %v", err)
			return nil, clientInstanceError
		}

		// Enviar un ping para confirmar la conexión
		err = client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err()
		if err != nil {
			clientInstanceError = fmt.Errorf("error al hacer ping a MongoDB: %v", err)
			return nil, clientInstanceError
		}

		clientInstance = client
		mongoOnce = true
		fmt.Println("Ping exitoso. ¡Conectado a MongoDB!")
	}
	return clientInstance, clientInstanceError
}
