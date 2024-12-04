package service

import (
	"context"
	"fmt"
	"time"

	"github.com/atuning120/proyectoIntegradorSoftwareCompass/ms-historial/internal/models"
	"github.com/atuning120/proyectoIntegradorSoftwareCompass/ms-historial/internal/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HistorialService interface {
	CrearHistorial(ctx context.Context, idUsuario string, idProductos []string) (*models.Historial, error)
	ObtenerHistoriales(ctx context.Context) ([]*models.Historial, error)
	ObtenerHistorialPorID(ctx context.Context, idUsuario string) ([]*models.Historial, error)
}

type HistorialServiceImpl struct {
	HistorialRepository *repository.HistorialRepositoryImpl
}

func NewHistorialServiceImpl(historialRepository *repository.HistorialRepositoryImpl) *HistorialServiceImpl {
	return &HistorialServiceImpl{
		HistorialRepository: historialRepository,
	}
}

func (s *HistorialServiceImpl) CrearHistorial(ctx context.Context, idUsuario string, idProductos []string) (*models.Historial, error) {
	userObjectID, err := primitive.ObjectIDFromHex(idUsuario)
	if err != nil {
		return nil, fmt.Errorf("error al convertir idUsuario a ObjectID: %v", err)
	}

	productObjectIDs, err := ConvertStringsToObjectIDs(idProductos)
	if err != nil {
		return nil, fmt.Errorf("error al convertir idProductos a ObjectID: %v", err)
	}

	historial := &models.Historial{
		UsuarioID:   userObjectID,
		Fecha:       primitive.NewDateTimeFromTime(time.Now()),
		IDProductos: productObjectIDs,
	}

	isValid, err := s.HistorialRepository.InsertHistorial(ctx, historial)
	if err != nil {
		return nil, fmt.Errorf("error al insertar historial: %v", err)
	}

	if !isValid {
		return nil, fmt.Errorf("no se pudo insertar el historial")
	}

	return historial, nil
}

func (s *HistorialServiceImpl) ObtenerHistoriales(ctx context.Context) ([]*models.Historial, error) {
	historiales, err := s.HistorialRepository.FindHistoriales(ctx)
	if err != nil {
		return nil, fmt.Errorf("error al obtener historiales: %v", err)
	}
	return historiales, nil
}

func (s *HistorialServiceImpl) ObtenerHistorialPorID(ctx context.Context, idUsuario string) ([]*models.Historial, error) {

	historiales, err := s.HistorialRepository.FindHistorialesByUserID(ctx, idUsuario)
	if err != nil {
		return nil, fmt.Errorf("error al obtener historiales por idUsuario: %v", err)
	}
	return historiales, nil
}

func ConvertStringsToObjectIDs(idStrings []string) ([]primitive.ObjectID, error) {
	var objectIDs []primitive.ObjectID
	for _, idStr := range idStrings {
		objectID, err := primitive.ObjectIDFromHex(idStr)
		if err != nil {
			return nil, fmt.Errorf("error al convertir id %s a ObjectID: %v", idStr, err)
		}
		objectIDs = append(objectIDs, objectID)
	}
	return objectIDs, nil
}
