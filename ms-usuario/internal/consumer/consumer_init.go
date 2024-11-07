package consumer

import (
	"log"
	"time"

	usuariovalidate "github.com/atuning120/proyectoIntegradorSoftware/ms-usuario/rabbit/usuario_validate"
)

func ConsumerInit() {
	go func() {
		for {
			err := usuariovalidate.ValidarUsuarioRespuesta()
			if err != nil {
				log.Printf("[x] Error en ValidarUsuarioRespuesta: %s", err)
			}
			time.Sleep(5 * time.Second)
		}
	}()
}
