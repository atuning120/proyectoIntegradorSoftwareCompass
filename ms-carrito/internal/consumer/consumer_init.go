package consumer

import (
	"fmt"
	"log"
	"time"

	"github.com/proyectoIntegradorSoftware/ms-carrito/internal/graph/model"
	carritovalidate "github.com/proyectoIntegradorSoftware/ms-carrito/rabbit/carrito_validate"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ConsumerInit() {
	go func() {
		for {
			err := carritovalidate.CrearCarritoRPC()
			if err != nil {
				log.Printf("[x] Error en consumeProducto: %s", err)
			}
			time.Sleep(5 * time.Second)
		}
	}()
}

func ValidacionProductoRPC(idProducto string) (*model.Carrito, error) {

	productoValid, err := carritovalidate.ValidarProductoRPC(idProducto)
	if err != nil {
		return nil, fmt.Errorf("el error es %v", err)
	}

	if !productoValid {
		log.Fatalf("El producto no existe %c", err)
		return nil, err
	}

	return nil, nil
}

func ValidacionUsuarioRPC(idUsuario string) (*model.Carrito, error) {
	usuarioValid, err := carritovalidate.ValidarUsuarioRPC(idUsuario)
	if err != nil {
		return nil, fmt.Errorf("el error es %v", err)
	}

	if !usuarioValid {
		log.Fatalf("El usuario no existe %c", err)
		return nil, err
	}

	return nil, nil
}

func ConvertObjectIDsToStrings(objectIDs []primitive.ObjectID) []string {
	var stringIDs []string
	for _, objID := range objectIDs {
		stringIDs = append(stringIDs, objID.Hex())
	}
	return stringIDs
}
