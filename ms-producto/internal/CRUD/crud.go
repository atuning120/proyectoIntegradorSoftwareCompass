package crud

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Estructura del Producto
type Product struct {
	ID          string  `bson:"_id"`
	Nombre      string  `bson:"nombre"`
	Descripcion string  `bson:"descripcion"`
	Precio      float64 `bson:"precio"`
	Imagen      string  `bson:"imagen"`
	Categoria   string  `bson:"categoria"`
	Nivel       string  `bson:"nivel"`
	Puntuacion  float64 `bson:"puntuacion"`
}

// Crear un nuevo producto
func CreateProduct(client *mongo.Client, product Product) error {
	collection := client.Database("Producto").Collection("producto")
	_, err := collection.InsertOne(context.TODO(), product)
	if err != nil {
		return fmt.Errorf("error al insertar el producto: %v", err)
	}
	fmt.Println("Producto insertado con éxito")
	return nil
}

// Obtener un producto por filtro
func GetProduct(client *mongo.Client, filter bson.M) (Product, error) {
	collection := client.Database("Producto").Collection("producto")
	var result Product
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return Product{}, fmt.Errorf("no se encontró ningún producto")
		}
		return Product{}, fmt.Errorf("error al buscar el producto: %v", err)
	}
	return result, nil
}

// Actualizar un producto
func UpdateProduct(client *mongo.Client, filter bson.M, update bson.M) error {
	collection := client.Database("Producto").Collection("producto")
	_, err := collection.UpdateOne(context.TODO(), filter, bson.M{"$set": update})
	if err != nil {
		return fmt.Errorf("error al actualizar el producto: %v", err)
	}
	fmt.Println("Producto actualizado con éxito")
	return nil
}

// Eliminar un producto
func DeleteProduct(client *mongo.Client, filter bson.M) error {
	collection := client.Database("Producto").Collection("producto")
	_, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return fmt.Errorf("error al eliminar el producto: %v", err)
	}
	fmt.Println("Producto eliminado con éxito")
	return nil
}

func GetAllCursos(client *mongo.Client) ([]Product, error) {
	collection := client.Database("Producto").Collection("producto")
	cursor, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, fmt.Errorf("error al obtener los cursos: %v", err)
	}
	var cursos []Product
	if err = cursor.All(context.TODO(), &cursos); err != nil {
		return nil, fmt.Errorf("error al decodificar los cursos: %v", err)
	}
	return cursos, nil
}

// Obtener los 4 mejores cursos por puntuación
func GetTopCursos(client *mongo.Client) ([]Product, error) {
	collection := client.Database("Producto").Collection("producto")
	opts := options.Find().SetSort(bson.D{{"puntuacion", -1}}).SetLimit(4)
	cursor, err := collection.Find(context.TODO(), bson.D{}, opts)
	if err != nil {
		return nil, fmt.Errorf("error al obtener los top cursos: %v", err)
	}
	var topCursos []Product
	if err = cursor.All(context.TODO(), &topCursos); err != nil {
		return nil, fmt.Errorf("error al decodificar los top cursos: %v", err)
	}
	return topCursos, nil
}
