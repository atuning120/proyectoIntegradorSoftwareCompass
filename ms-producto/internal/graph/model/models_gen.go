// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Curso struct {
	ID          string  `json:"id"`
	Nombre      string  `json:"nombre"`
	Descripcion string  `json:"descripcion"`
	Precio      float64 `json:"precio"`
	Imagen      string  `json:"imagen"`
	Categoria   string  `json:"categoria"`
	Nivel       string  `json:"nivel"`
	Puntuacion  float64 `json:"puntuacion"`
}

type Mutation struct {
}

type NewCurso struct {
	Nombre      string  `json:"nombre"`
	Descripcion string  `json:"descripcion"`
	Precio      float64 `json:"precio"`
	Imagen      string  `json:"imagen"`
	Categoria   string  `json:"categoria"`
	Nivel       string  `json:"nivel"`
	Puntuacion  float64 `json:"puntuacion"`
}

type Query struct {
}
