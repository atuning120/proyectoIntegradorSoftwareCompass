package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ProductoRepository interface {
	FindProduct(context.Context, string) (bool, error)
	GetProducts(context.Context, []string) ([]models.Product, error)
	InsertOne(context.Context, models.Product) (primitive.ObjectID, error)
	GetAllCursos(ctx context.Context) ([]models.Product, error)
	GetTopCursos(ctx context.Context) ([]models.Product, error)
}

type ProductoRepositoryImpl struct {
	Collection *mongo.Collection
}

func NewProductoRepositoryImpl(db *mongo.Database) *ProductoRepositoryImpl {
	return &ProductoRepositoryImpl{
		Collection: db.Collection("producto"),
	}
}

func (r *ProductoRepositoryImpl) GetTopCursos(ctx context.Context) ([]models.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// Consulta para obtener los 4 cursos con mayor puntuación
	options := options.Find().SetSort(bson.D{{"puntuacion", -1}}).SetLimit(4)
	cursor, err := r.Collection.Find(ctx, bson.D{}, options)
	if err != nil {
		return nil, fmt.Errorf("error al obtener los top cursos: %v", err)
	}
	defer cursor.Close(ctx)

	var topCursos []models.Product
	if err := cursor.All(ctx, &topCursos); err != nil {
		return nil, fmt.Errorf("error al decodificar los top cursos: %v", err)
	}

	return topCursos, nil
}

func (r *ProductoRepositoryImpl) GetAllCursos(ctx context.Context) ([]models.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// Consulta para obtener todos los documentos de la colección "producto"
	cursor, err := r.Collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, fmt.Errorf("error al obtener los cursos: %v", err)
	}
	defer cursor.Close(ctx)

	var cursos []models.Product
	if err := cursor.All(ctx, &cursos); err != nil {
		return nil, fmt.Errorf("error al decodificar los cursos: %v", err)
	}

	return cursos, nil
}

func (r *ProductoRepositoryImpl) InsertOne(ctx context.Context, product models.Product) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	result, err := r.Collection.InsertOne(ctx, product)
	if err != nil {
		log.Println("Error al insertar el producto:", err)
		return primitive.NilObjectID, err
	}

	// Obtener el ID generado y retornarlo
	oid, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("error al obtener el ID del producto")
	}

	return oid, nil
}

func (r *ProductoRepositoryImpl) GetProducts(ctx context.Context, ids []string) ([]models.Product, error) {

	var result []models.Product
	for _, id := range ids {
		objID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, err
		}

		var curso models.Product
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
