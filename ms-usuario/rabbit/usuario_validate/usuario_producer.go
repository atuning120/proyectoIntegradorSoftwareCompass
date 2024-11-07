package usuariovalidate

import (
	"fmt"
	"log"
	"math/rand"

	"github.com/atuning120/proyectoIntegradorSoftware/ms-usuario/rabbit"
	"github.com/streadway/amqp"
)

func ValidarCarritoRPC(idUsuario string) (isValid bool, err error) {
	conn, err := rabbit.ConnectToRabbit()
	rabbit.FailedailOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	rabbit.FailedailOnError(err, "Failed to connect to RabbitMQ")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"",    // name
		false, // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	rabbit.FailedailOnError(err, "Failed to connect to RabbitMQ")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	rabbit.FailedailOnError(err, "Failed to register a consumer")

	corrId := randomString(32)

	err = ch.Publish(
		"",                     // exchange
		"rpc_creacion_carrito", // routing key
		false,                  // 	mandatory
		false,                  // immediate
		amqp.Publishing{
			DeliveryMode:  amqp.Persistent,
			ContentType:   "text/plain",
			CorrelationId: corrId,
			ReplyTo:       q.Name,
			Body:          []byte(idUsuario),
		})

	for d := range msgs {
		if corrId == d.CorrelationId {
			log.Printf("Received a message: %s", d.Body)
			if string(d.Body) == "true" {
				return true, nil
			} else if string(d.Body) == "false" {
				return false, nil
			} else {
				return false, fmt.Errorf("unexpected response: %s", d.Body)
			}
		}
	}
	return false, nil
}

// Generar un id aleatorio para cada RPC
func randomString(l int) string {
	bytes := make([]byte, l)
	for i := 0; i < l; i++ {
		bytes[i] = byte(randInt(65, 90))
	}
	return string(bytes)
}

func randInt(min int, max int) int {
	return min + rand.Intn(max-min)
}
