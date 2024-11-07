package services

import (
	"context"
	"fmt"

	"github.com/proyectoIntegradorSoftware/ms-carrito/internal/models"
	"github.com/proyectoIntegradorSoftware/ms-carrito/internal/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ServicioHistorial interface {
	CreacionCarrito(ctx context.Context, idUsuario string, idProducto string) (bool, error)
	AnadirProduct(ctx context.Context, idUsuario string, idProducto string) (bool, error)
	EliminarProducto(ctx context.Context, idUsuario string, idProducto string) (bool, error)
	EliminarProductos(ctx context.Context, idUsuario string) (bool, error)
}

type ServicioHistorialImpl struct {
	Repository repository.HistorialRepository
}

func NewServicioHistorialImpl(repository repository.HistorialRepository) *ServicioHistorialImpl {
	return &ServicioHistorialImpl{
		Repository: repository,
	}
}

func (s *ServicioHistorialImpl) EliminarProductos(ctx context.Context, idUsuario string) (bool, error) {
	isDeleted, err := s.Repository.DeleteAllProducts(ctx, idUsuario)
	if err != nil {
		fmt.Printf("Error al eliminar todos los productos del carrito: %v\n", err)
		return isDeleted, fmt.Errorf("error al eliminar todos los productos del carrito: %v", err)
	}

	return isDeleted, nil
}

func (s *ServicioHistorialImpl) EliminarProducto(ctx context.Context, idUsuario string, idProducto string) (bool, error) {
	carrito, err := s.Repository.FindById(ctx, idUsuario)
	if err != nil {
		fmt.Printf("Error al buscar el carrito correspondiente al usuario: %v\n", err)
		return false, fmt.Errorf("error al buscar el carrito correspondiente al usuario: %v", err)
	}

	isValid, err := s.Repository.DeleteOneProduct(ctx, idProducto, carrito)
	if err != nil {
		fmt.Printf("Error al actualizar el carrito en MongoDB: %v\n", err)
		return isValid, fmt.Errorf("error al actualizar el carrito en MongoDB: %v", err)
	}

	return isValid, nil

}

func (s *ServicioHistorialImpl) AnadirProduct(ctx context.Context, idUsuario string, idProducto string) (bool, error) {

	objectIdProducto, err := primitive.ObjectIDFromHex(idProducto)
	if err != nil {
		fmt.Printf("Error al convertir idProducto a ObjectID: %v\n", err)
		return false, fmt.Errorf("error al convertir idProducto a ObjectID: %v", err)
	}

	carrito, err := s.Repository.FindById(ctx, idUsuario)
	if err != nil {
		fmt.Printf("Error al buscar el carrito correspondiente al usuario: %v\n", err)
		return false, fmt.Errorf("error al buscar el carrito correspondiente al usuario: %v", err)
	}

	for _, producto := range carrito.IDProductos {
		if producto == objectIdProducto {
			fmt.Println("El producto ya existe dentro del carrito")
			return true, nil
		}
	}

	carrito.IDProductos = append(carrito.IDProductos, objectIdProducto)

	// Insertar el producto en MongoDB
	isValid, err := s.Repository.InsertProduct(ctx, carrito)
	if err != nil {
		fmt.Printf("Error al actualizar el carrito en MongoDB: %v\n", err)
		return isValid, fmt.Errorf("error al actualizar el carrito en MongoDB: %v", err)
	}

	return isValid, nil
}

func (s *ServicioHistorialImpl) CreacionCarrito(ctx context.Context, idUsuario string) (confirmacion bool, err error) {
	objectID, err := primitive.ObjectIDFromHex(idUsuario)
	if err != nil {
		return false, fmt.Errorf("error al convertir idUsuario a ObjectID: %v", err)
	}

	historial := models.Carrito{
		IDUsuario:   objectID,
		IDProductos: []primitive.ObjectID{},
	}

	_, err = s.Repository.InsertOne(ctx, historial)
	if err != nil {
		return false, fmt.Errorf("error al insertar el historial en MongoDB: %v", err)
	}

	return true, nil
}
