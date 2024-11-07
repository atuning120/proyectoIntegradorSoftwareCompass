package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Producto struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Nombre      string             `bson:"nombre" json:"nombre"`
	Descripcion string             `bson:"descripcion" json:"descripcion"`
	Precio      float64            `bson:"precio" json:"precio"`
	Imagen      string             `bson:"imagen" json:"imagen"`
	Categoria   string             `bson:"categoria" json:"categoria"`
	Nivel       string             `bson:"nivel" json:"nivel"`
	Puntuacion  float64            `bson:"puntuacion" json:"puntuacion"`
}
