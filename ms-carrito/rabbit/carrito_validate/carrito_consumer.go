package carritovalidate

import (
	"context"
	"fmt"
	"log"

	connection "github.com/proyectoIntegradorSoftware/ms-carrito/internal/database"
	"github.com/proyectoIntegradorSoftware/ms-carrito/internal/repository"
	"github.com/proyectoIntegradorSoftware/ms-carrito/internal/services"
	"github.com/proyectoIntegradorSoftware/ms-carrito/rabbit"
	"github.com/streadway/amqp"
)

func CrearCarritoRPC() error {
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
		"rpc_creacion_carrito",
		false, // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare a queue: %w", err)
	}

	err = ch.Qos(1, 0, false)
	if err != nil {
		return fmt.Errorf("failed to set QoS: %w", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		false, // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to register a consumer: %w", err)
	}

	client, err := connection.ConnectToMongoDB()
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatalf("Error desconectando MongoDB: %v", err)
		}
	}()

	db := client.Database("Carrito")
	carritorepo := repository.NewHisotialRepositoryImpl(db)
	carritoService := services.NewServicioHistorialImpl(carritorepo)

	go func() {
		for d := range msgs {
			idUsuario := string(d.Body)
			log.Printf(" [.] Procesando solicitud para ID de usuario: %s", idUsuario)

			// Intentar crear el carrito
			existe, err := carritoService.CreacionCarrito(context.Background(), idUsuario)
			if err != nil {
				log.Printf("Error en la creación del carrito: %s", err)
				continue
			}

			respuesta := "false"
			if existe {
				respuesta = "true"
			}

			// Responder al productor con el resultado
			err = ch.Publish(
				"",
				d.ReplyTo,
				false, // mandatory
				false, // immediate
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

	log.Printf(" [*] Esperando solicitudes de creación de carrito")
	select {} // Mantiene el consumidor activo.
}
