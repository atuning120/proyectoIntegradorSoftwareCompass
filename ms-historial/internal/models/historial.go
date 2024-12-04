package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Historial struct {
	ID          primitive.ObjectID   ` bson:"_id,omitempty" json:"id,omitempty"`
	UsuarioID   primitive.ObjectID   ` bson:"usuario_id" json:"usuario_id"`
	Fecha       primitive.DateTime   ` bson:"fecha" json:"fecha"`
	IDProductos []primitive.ObjectID ` bson:"id_productos" json:"id_productos"`
}
