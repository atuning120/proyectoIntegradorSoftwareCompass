import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { productClient, cartClient } from '../apolloClient';
import { CircularProgress } from "@nextui-org/react";

// Definir la query GraphQL
const TOP_CURSOS = gql`
  query TopCursos {
    topCursos {
      id
      nombre
      descripcion
      precio
      imagen
      categoria
      nivel
    }
  }
`;

// Definir la mutación para agregar un producto
const AGREGAR_PRODUCTO = gql`
  mutation AgregarProducto($IDUsuario: ID!, $IDProducto: ID!) {
    AgregarProducto(input: { IDUsuario: $IDUsuario, IDProducto: $IDProducto }) {
      id
      idUsuario
      idProductos
    }
  }
`;

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Función para extraer el ID del usuario
const ExtraerIdUsuario = () => {
  if (isAuthenticated()) {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.id;
  } else {
    console.warn('Usuario no autenticado');
    return null;
  }
};

function ProductGrid() {
  const { loading, error, data } = useQuery(TOP_CURSOS, { client: productClient });
  const [agregarProducto] = useMutation(AGREGAR_PRODUCTO, { client: cartClient });

  // Estado para controlar qué botón está añadiendo un producto
  const [loadingProduct, setLoadingProduct] = useState(null);

  // Mostrar spinner mientras los datos se cargan
  if (loading) return <CircularProgress aria-label="Loading..." />;

  // Manejar errores de la query
  if (error) {
    console.error('Error al cargar los cursos:', error);
    return <p>Error al cargar los cursos. Intenta nuevamente más tarde.</p>;
  }

  // Función para añadir un producto al carrito
  const AddCarritoFunc = async (id) => {
    const idUsuario = ExtraerIdUsuario();
    if (!idUsuario) return; // No ejecutar si no hay usuario

    setLoadingProduct(id); // Establecer el producto que está añadiendo

    try {
      await agregarProducto({
        variables: {
          IDUsuario: idUsuario,
          IDProducto: id,
        },
      });
      console.log(`Producto ${id} añadido al carrito`);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    } finally {
      setLoadingProduct(null); // Restablecer el estado de carga
    }
  };

  const products = data.topCursos;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Cursos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{product.nombre}</h3>
            <p className="text-gray-600 flex-grow">{product.descripcion}</p>
            <p className="text-gray-600">{product.categoria} - {product.nivel}</p>
            <div className="mt-4">
              <span className="text-xl font-bold">
                ${product.precio.toLocaleString('es-ES')}
              </span>
            </div>
            <button
              onClick={() => AddCarritoFunc(product.id)}
              className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
              disabled={loadingProduct === product.id}
            >
              {loadingProduct === product.id ? 'Añadiendo...' : 'Añadir al Carrito'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
