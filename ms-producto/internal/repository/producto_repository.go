package repository

import (
	"context"
	"log"
	"time"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProductoRepository interface {
	FindProduct(context.Context, string) (bool, error)
	GetProducts(context.Context, []string) ([]models.Producto, error)
}

type ProductoRepositoryImpl struct {
	Collection *mongo.Collection
}

func NewProductoRepositoryImpl(db *mongo.Database) *ProductoRepositoryImpl {
	return &ProductoRepositoryImpl{
		Collection: db.Collection("producto"),
	}
}

func (r *ProductoRepositoryImpl) GetProducts(ctx context.Context, ids []string) ([]models.Producto, error) {

	var result []models.Producto
	for _, id := range ids {
		objID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, err
		}

		var curso models.Producto
		filter := bson.M{"_id": objID}

		err = r.Collection.FindOne(ctx, filter).Decode(&curso)
		if err != nil {
			log.Println("Error al buscar curso:", err)
			return nil, err
		}

		result = append(result, curso)
	}
	return result, nil
}

func (r *ProductoRepositoryImpl) FindProduct(ctx context.Context, idProducto string) (bool, error) {

	objID, err := primitive.ObjectIDFromHex(idProducto)
	if err != nil {
		return false, err
	}

	var result bson.M
	filter := bson.M{"_id": objID}

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	err = r.Collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		log.Println("Error al buscar usuario:", err)
		return false, err
	}

	return true, nil
}
