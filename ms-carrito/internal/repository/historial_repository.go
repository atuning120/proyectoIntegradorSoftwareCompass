package repository

import (
	"context"
	"fmt"

	"github.com/proyectoIntegradorSoftware/ms-carrito/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type HistorialRepository interface {
	InsertOne(ctx context.Context, historial models.Carrito) (bool, error)
	InsertProduct(ctx context.Context, historial models.Carrito) (bool, error)
	FindById(ctx context.Context, id string) (models.Carrito, error)
	FindByIdCarrito(ctx context.Context, id string) (models.Carrito, error)
	DeleteOneProduct(ctx context.Context, id string, carrito models.Carrito) (bool, error)
	DeleteAllProducts(ctx context.Context, id string) (bool, error)
}

type HistorialRepositoryImpl struct {
	Collection *mongo.Collection
}

func NewHisotialRepositoryImpl(db *mongo.Database) *HistorialRepositoryImpl {
	return &HistorialRepositoryImpl{
		Collection: db.Collection("carrito"),
	}
}

func (s *HistorialRepositoryImpl) DeleteAllProducts(ctx context.Context, id string) (bool, error) {

	objectIdUsuario, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Printf("Error al convertir id a ObjectID: %v\n", err)
		return false, fmt.Errorf("error al convertir id a ObjectID: %v", err)
	}

	filter := bson.M{"id_usuario": objectIdUsuario}
	update := bson.M{"$set": bson.M{"id_productos": []primitive.ObjectID{}}}

	_, err = s.Collection.UpdateOne(ctx, filter, update)
	if err != nil {
		fmt.Printf("Error en UpdateOne: %v\n", err)
		return false, err
	}

	return true, nil
}

func (s *HistorialRepositoryImpl) DeleteOneProduct(ctx context.Context, idProducto string, carrito models.Carrito) (bool, error) {

	objectProdId, err := primitive.ObjectIDFromHex(idProducto)
	if err != nil {
		return false, err
	}

	filter := bson.M{"id_usuario": carrito.IDUsuario}
	update := bson.M{"$pull": bson.M{"id_productos": objectProdId}}

	result, err := s.Collection.UpdateOne(ctx, filter, update)
	if err != nil {
		fmt.Printf("Error en UpdateOne: %v\n", err)
		return false, err
	}

	if result.ModifiedCount == 0 {
		fmt.Println("No se encontró el producto en el carrito.")
		return false, nil
	}

	fmt.Println("Producto eliminado correctamente del carrito.")
	return true, nil
}

func (s *HistorialRepositoryImpl) FindByIdCarrito(ctx context.Context, id string) (models.Carrito, error) {
	var result models.Carrito

	objectIdCarrito, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Printf("Error al convertir id a ObjectID: %v\n", err)
		return result, fmt.Errorf("error al convertir id a ObjectID: %v", err)
	}

	err = s.Collection.FindOne(ctx, bson.M{"_id": objectIdCarrito}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("No se encontró ningún documento con el ID proporcionado")
			return result, nil
		}
		fmt.Printf("Error al decodificar el resultado de FindOne: %v\n", err)
		return result, err
	}
	return result, nil
}

func (s *HistorialRepositoryImpl) FindAllCarritos(ctx context.Context) ([]models.Carrito, error) {
	var resultados []models.Carrito

	cursor, err := s.Collection.Find(ctx, bson.M{})
	if err != nil {
		fmt.Printf("Error al ejecutar Find: %v\n", err)
		return resultados, err
	}
	defer cursor.Close(ctx)

	// Iterar sobre los resultados y decodificar cada uno en un struct Carrito
	for cursor.Next(ctx) {
		var carrito models.Carrito
		if err := cursor.Decode(&carrito); err != nil {
			fmt.Printf("Error al decodificar el carrito: %v\n", err)
			return resultados, err
		}
		resultados = append(resultados, carrito)
	}

	if err := cursor.Err(); err != nil {
		fmt.Printf("Error al iterar sobre el cursor: %v\n", err)
		return resultados, err
	}

	return resultados, nil
}

func (s *HistorialRepositoryImpl) FindById(ctx context.Context, id string) (models.Carrito, error) {
	var result models.Carrito

	objectIdUsuario, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Printf("Error al convertir id a ObjectID: %v\n", err)
		return result, fmt.Errorf("error al convertir id a ObjectID: %v", err)
	}

	err = s.Collection.FindOne(ctx, bson.M{"id_usuario": objectIdUsuario}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("No se encontró ningún documento con el ID proporcionado")
			return result, nil
		}
		fmt.Printf("Error al decodificar el resultado de FindOne: %v\n", err)
		return result, err
	}
	return result, nil
}

func (s *HistorialRepositoryImpl) InsertProduct(ctx context.Context, carrito models.Carrito) (bool, error) {

	filter := bson.M{"id_usuario": carrito.IDUsuario}
	update := bson.M{"$set": bson.M{"id_productos": carrito.IDProductos}}

	_, err := s.Collection.UpdateOne(ctx, filter, update)
	if err != nil {
		fmt.Printf("Error en UpdateOne: %v\n", err)
		return false, err
	}

	return true, nil
}

func (s *HistorialRepositoryImpl) InsertOne(ctx context.Context, historial models.Carrito) (bool, error) {

	_, err := s.Collection.InsertOne(ctx, historial)
	if err != nil {
		return false, err
	}

	return true, nil
}
