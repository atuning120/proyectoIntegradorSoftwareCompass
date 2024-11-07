package productovalidate

import (
	"context"
	"fmt"
	"log"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/connection"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/repository"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/internal/service"
	"github.com/atuning120/proyectoIntegradorSoftware/ms-producto/rabbit"
	"github.com/streadway/amqp"
)

func ValidarProductoRespuesta() error {
	conn, err := rabbit.ConnectToRabbit()
	if err != nil {
		return fmt.Errorf("Failed to connect to RabbitMQ: %w", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("Failed to open a channel: %w", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"rpc_producto", // name
		false,          // durable
		false,          // delete when unused
		false,          // exclusive
		false,          // no-wait
		nil,            // arguments
	)
	if err != nil {
		return fmt.Errorf("Failed to declare a queue: %w", err)
	}

	err = ch.Qos(1, 0, false)
	if err != nil {
		return fmt.Errorf("Failed to set QoS: %w", err)
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
		return fmt.Errorf("Failed to register a consumer: %w", err)
	}

	// Configuración de MongoDB
	client, err := connection.ConnectToMongoDB()
	if err != nil {
		return fmt.Errorf("Failed to connect to MongoDB: %w", err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("Producto")
	productorepo := repository.NewProductoRepositoryImpl(db)
	productoserv := service.NewProductoServiceImpl(productorepo)

	go func() {
		for d := range msgs {
			idUsuario := string(d.Body)
			log.Printf(" [.] Validando producto con ID: %s", idUsuario)

			existe, err := productoserv.ValidarProducto(context.Background(), idUsuario)
			if err != nil {
				log.Printf("Error validando producto: %s", err)
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

			d.Ack(false)
		}
	}()

	log.Printf(" [*] Esperando solicitudes de validación de producto")
	select {} // Esta línea es la que bloquea indefinidamente.
}
