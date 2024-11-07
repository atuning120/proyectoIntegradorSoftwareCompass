package rabbit

import (
	"log"

	"github.com/streadway/amqp"
)

func ConnectToRabbit() (*amqp.Connection, error) {
	conn, err := amqp.Dial("amqp://user:1709@localhost:5672/")
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	return conn, nil
}

func FailedailOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}
