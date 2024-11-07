package usuariovalidate

import (
	"context"
	"fmt"
	"log"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-usuario/internal/db"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-usuario/internal/repository"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-usuario/internal/service"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-usuario/rabbit"
	"github.com/streadway/amqp"
)

func ValidarUsuarioRespuesta() error {
	conn, err := rabbit.ConnectToRabbit()
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open a channel: %w", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"rpc_usuario", // name
		false,         // durable
		false,         // delete when unused
		false,         // exclusive
		false,         // no-wait
		nil,           // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare a queue: %w", err)
	}

	err = ch.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		return fmt.Errorf("failed to set QoS: %w", err)
	}

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		return fmt.Errorf("failed to register a consumer: %w", err)
	}

	// Conexión a MongoDB
	client, err := db.ConnectToMongoDB()
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("Usuario")
	usuariorepo := repository.NewUsuarioRepository(db)
	usuarioserv := service.NewUsuarioService(usuariorepo)

	go func() {
		for d := range msgs {

			idUsuario := string(d.Body)

			// Validar si el idUsuario tiene el formato adecuado de ObjectID
			if len(idUsuario) != 24 {
				log.Printf("Error: el ID proporcionado no tiene un formato válido: %s", idUsuario)
				continue
			}

			log.Printf(" [.] Validando usuario con ID: %s", idUsuario)
			existe, err := usuarioserv.ValidarUsuario(context.Background(), idUsuario)
			if err != nil {
				log.Printf("Error validando usuario: %s", err)
				continue
			}

			respuesta := "false"
			if existe {
				respuesta = "true"
			}

			err = ch.Publish(
				"",        // exchange
				d.ReplyTo, // routing key
				false,     // mandatory
				false,     // immediate
				amqp.Publishing{
					ContentType:   "text/plain",
					CorrelationId: d.CorrelationId,
					Body:          []byte(respuesta),
				})
			if err != nil {
				log.Printf("Failed to publish a message: %s", err)
				continue
			}

			// Confirmar que el mensaje ha sido procesado
			d.Ack(false)
		}
	}()

	log.Printf(" [*] Esperando solicitudes de validación de usuario")
	select {} // Esta línea bloquea la función indefinidamente para mantener el consumidor activo.
}
