package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Carrito struct {
	ID          primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	IDUsuario   primitive.ObjectID   `bson:"id_usuario" json:"idUsuario"`
	IDProductos []primitive.ObjectID `bson:"id_productos" json:"idProductos"`
}
