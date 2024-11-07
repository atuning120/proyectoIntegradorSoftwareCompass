package service

import (
	"context"
	"log"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-usuario/internal/repository"
)

type UsuarioService struct {
	Repo *repository.UsuarioRepository
}

func NewUsuarioService(repo *repository.UsuarioRepository) *UsuarioService {
	return &UsuarioService{
		Repo: repo,
	}
}

func (s *UsuarioService) CambioApellido(ctx context.Context, idUsuario string, apellido string) (bool, error) {
	update, err := s.Repo.UpdateApellido(ctx, idUsuario, apellido)
	if err != nil {
		log.Println("Error validando apellido:", err)
		return false, err
	}

	return update, nil
}

func (s *UsuarioService) CambioCorreo(ctx context.Context, idUsuario string, correo string) (bool, error) {
	update, err := s.Repo.UpdateEmail(ctx, idUsuario, correo)
	if err != nil {
		log.Println("Error validando correo:", err)
		return false, err
	}

	return update, nil
}

func (s *UsuarioService) CambioNombreUsuario(ctx context.Context, idUsuario string, username string) (bool, error) {
	update, err := s.Repo.UpdateUsername(ctx, idUsuario, username)
	if err != nil {
		log.Println("Error validando username:", err)
		return false, err
	}

	return update, nil
}

func (s *UsuarioService) CambioNombre(ctx context.Context, idUsuario string, nombreNuevo string) (bool, error) {
	update, err := s.Repo.UpdateName(ctx, idUsuario, nombreNuevo)
	if err != nil {
		log.Println("Error validando usuario:", err)
		return false, err
	}

	return update, nil
}

func (s *UsuarioService) ValidarUsuario(ctx context.Context, id string) (bool, error) {
	existe, err := s.Repo.ExisteUsuario(ctx, id)
	if err != nil {
		log.Println("Error validando usuario:", err)
		return false, err
	}

	return existe, nil
}
