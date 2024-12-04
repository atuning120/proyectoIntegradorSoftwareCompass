package repository

import (
	"context"
	"fmt"

	"github.com/atuning120/proyectoIntegradorSoftwareCompass/ms-historial/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type HistorialRepository interface {
	InsertHistorial(ctx context.Context, historial *models.Historial) (bool, error)
	FindHistoriales(ctx context.Context) ([]*models.Historial, error)
	FindHistorialesByUserID(ctx context.Context, userID string) ([]*models.Historial, error)
}

type HistorialRepositoryImpl struct {
	Collection *mongo.Collection
}

func NewHistorialRepositoryImpl(db *mongo.Database) *HistorialRepositoryImpl {
	return &HistorialRepositoryImpl{
		Collection: db.Collection("historial"),
	}
}

func (s *HistorialRepositoryImpl) InsertHistorial(ctx context.Context, historial *models.Historial) (bool, error) {
	_, err := s.Collection.InsertOne(ctx, historial)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s *HistorialRepositoryImpl) FindHistoriales(ctx context.Context) ([]*models.Historial, error) {
	cursor, err := s.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var historiales []*models.Historial
	if err = cursor.All(ctx, &historiales); err != nil {
		return nil, err
	}

	return historiales, nil
}

func (s *HistorialRepositoryImpl) FindHistorialesByUserID(ctx context.Context, userID string) ([]*models.Historial, error) {
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("error al convertir idUsuario a ObjectID: %v", err)
	}

	cursor, err := s.Collection.Find(ctx, bson.M{"usuario_id": userObjectID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var historiales []*models.Historial
	if err = cursor.All(ctx, &historiales); err != nil {
		return nil, err
	}

	return historiales, nil
}
