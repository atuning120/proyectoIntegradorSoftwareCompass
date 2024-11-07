package crud

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Crear un nuevo usuario
func CreateUser(client *mongo.Client, user bson.M) error {
	collection := client.Database("Usuario").Collection("usuario")
	_, err := collection.InsertOne(context.TODO(), user)
	if err != nil {
		return fmt.Errorf("error al insertar el documento: %v", err)
	}
	fmt.Println("Usuario insertado con éxito")
	return nil
}

func GetUser(client *mongo.Client, filter bson.M) (bson.M, error) {
	collection := client.Database("Usuario").Collection("usuario")
	var result bson.M
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("no se encontró ningún documento")
		}
		return nil, fmt.Errorf("error al buscar el documento: %v", err)
	}
	return result, nil
}

// Actualizar usuario
func UpdateUser(client *mongo.Client, filter bson.M, update bson.M) error {
	collection := client.Database("Usuario").Collection("usuario")
	_, err := collection.UpdateOne(context.TODO(), filter, bson.M{"$set": update})
	if err != nil {
		return fmt.Errorf("error al actualizar el documento: %v", err)
	}
	fmt.Println("Usuario actualizado con éxito")
	return nil
}

// Eliminar un usuario
func DeleteUser(client *mongo.Client, filter bson.M) error {
	collection := client.Database("Usuario").Collection("usuario")
	_, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return fmt.Errorf("error al eliminar el documento: %v", err)
	}
	fmt.Println("Usuario eliminado con éxito")
	return nil
}
