package service

import (
	"context"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/models"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProductoService interface {
	ValidarProducto(context.Context, string) (bool, error)
	BuscarCursos(context.Context, []string) ([]models.Product, error)
	CrearProducto(context.Context, models.Product) (primitive.ObjectID, error)
	GetAllCursos(ctx context.Context) ([]models.Product, error)
	GetTopCursos(ctx context.Context) ([]models.Product, error)
}

type ProductoServiceImpl struct {
	ProductoRepository repository.ProductoRepository
}

func NewProductoServiceImpl(repo repository.ProductoRepository) *ProductoServiceImpl {
	return &ProductoServiceImpl{
		ProductoRepository: repo,
	}
}

func (s *ProductoServiceImpl) GetTopCursos(ctx context.Context) ([]models.Product, error) {
	// Llama al repositorio para obtener los 4 cursos con mayor puntuación
	topCursos, err := s.ProductoRepository.GetTopCursos(ctx)
	if err != nil {
		return nil, err
	}

	return topCursos, nil
}

func (s *ProductoServiceImpl) GetAllCursos(ctx context.Context) ([]models.Product, error) {
	// Llama al repositorio para obtener todos los cursos
	cursos, err := s.ProductoRepository.GetAllCursos(ctx)
	if err != nil {
		return nil, err
	}

	return cursos, nil
}

func (s *ProductoServiceImpl) CrearProducto(ctx context.Context, product models.Product) (primitive.ObjectID, error) {
	// Llama al repositorio para insertar el producto y obtener el ObjectID generado
	oid, err := s.ProductoRepository.InsertOne(ctx, product)
	if err != nil {
		return primitive.NilObjectID, err
	}

	return oid, nil
}

func (s *ProductoServiceImpl) BuscarCursos(ctx context.Context, ids []string) ([]models.Product, error) {
	cursos, err := s.ProductoRepository.GetProducts(ctx, ids)
	if err != nil {
		return nil, err
	}

	return cursos, nil
}

func (s *ProductoServiceImpl) ValidarProducto(ctx context.Context, idProducto string) (bool, error) {
	existe, err := s.ProductoRepository.FindProduct(ctx, idProducto)
	if err != nil {
		return false, err
	}

	return existe, nil
}
