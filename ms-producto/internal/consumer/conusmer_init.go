package consumer

import (
	"fmt"
	"log"
	"time"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/graph/model"
	productovalidate "github.com/atuning120/proyectoIntegradorSoftware/ms-producto/rabbit/producto_validate"
)

func ProductoConsumidores() {
	go func() {
		for {
			err := productovalidate.ValidarProductoRespuesta()
			if err != nil {
				log.Printf("[x] Error en consumeProducto: %s", err)
			}
			time.Sleep(5 * time.Second)
		}
	}()
}

func ValidacionProductoRPC(idProducto string) (*model.Curso, error) {

	productoValid, err := productovalidate.ValidarProductoRPC(idProducto)
	if err != nil {
		return nil, fmt.Errorf("el error es %v", err)
	}

	if !productoValid {
		log.Fatalf("El producto no existe %c", err)
		return nil, err
	}

	return nil, nil
}

func ValidacionUsuarioRPC(idUsuario string) (*model.Curso, error) {
	usuarioValid, err := productovalidate.ValidateUsuarioRPC(idUsuario)
	if err != nil {
		return nil, fmt.Errorf("el error es %v", err)
	}

	if !usuarioValid {
		log.Fatalf("El usuario no existe %c", err)
		return nil, err
	}

	return nil, nil
}
