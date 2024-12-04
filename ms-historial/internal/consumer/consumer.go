package consumer

import (
	"fmt"
	"log"

	"github.com/atuning120/proyectoIntegradorSoftwareCompass/ms-historial/internal/graph/model"
	historialvalidate "github.com/atuning120/proyectoIntegradorSoftwareCompass/ms-historial/rabbit/historial_validate"
)

func ValidarUsuarioRPC(idUsuario string) (*model.Historial, error) {
	usuarioValid, err := historialvalidate.ValidarUsuarioRPC(idUsuario)
	if err != nil {
		return nil, fmt.Errorf("el error es %v", err)
	}

	if !usuarioValid {
		log.Fatalf("El usuario no existe %c", err)
		return nil, err
	}

	return nil, nil
}

func ValidarProductoRPC(idProducto string) (*model.Historial, error) {
	productoValid, err := historialvalidate.ValidarProductoRPC(idProducto)
	if err != nil {
		return nil, fmt.Errorf("el error es %v", err)
	}

	if !productoValid {
		log.Fatalf("El producto no existe %c", err)
		return nil, err
	}

	return nil, nil
}
