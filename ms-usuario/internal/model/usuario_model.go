package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Usuario struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Username string             `bson:"username" json:"username"`
	Nombre   string             `bson:"nombre" json:"nombre"`
	Apellido string             `bson:"apellido" json:"apellido"`
	Correo   string             `bson:"correo" json:"correo"`
	Telefono string             `bson:"telefono" json:"telefono"`
	Rol      string             `bson:"rol" json:"rol"`
	Edad     int                `bson:"edad" json:"edad"`
	Password string             `bson:"password" json:"password"`
}
