// ProductGrid.jsx
import React, { useContext, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { productClient, cartClient, historialClient } from '../apolloClient'; // Asegúrate de importar historialClient
import { CircularProgress } from "@nextui-org/react";
import Tostadas from './Tostadas';
import { ToastContainer } from 'react-toastify';
import { CartContext } from '../context/CartContext';

// Definir la query GraphQL para obtener el historial de compras del usuario
const OBTENER_HISTORIAL_POR_USUARIO = gql`
  query ObtenerHistorialPorUsuario($idUsuario: ID!) {
    ObtenerHistorialPorUsuario(idUsuario: $idUsuario) {
      id
      idUsuario
      fecha
      idProductos
    }
  }
`;

// Definir la query GraphQL para obtener los cursos destacados
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
  const { cartItems, setCartItems } = useContext(CartContext);

  // Estado para controlar qué botón está añadiendo un producto
  const [loadingProduct, setLoadingProduct] = useState(null);

  // Obtener el ID del usuario
  const idUsuario = ExtraerIdUsuario();

  // Utilizar la consulta para obtener el historial de compras del usuario
  const {
    data: historialData,
    loading: historialLoading,
    error: historialError,
  } = useQuery(OBTENER_HISTORIAL_POR_USUARIO, {
    variables: { idUsuario },
    skip: !idUsuario, // Omitir la consulta si no hay usuario
    client: historialClient, // Asegúrate de tener configurado historialClient
    fetchPolicy: 'network-only', // Opcional: para asegurar datos actualizados
  });

  // Mostrar spinner mientras los datos se cargan
  if (loading || historialLoading) return <CircularProgress aria-label="Loading..." />;

  // Manejar errores de las queries
  if (error) {
    console.error('Error al cargar los cursos:', error);
    return <p>Error al cargar los cursos. Intenta nuevamente más tarde.</p>;
  }

  if (historialError) {
    console.error('Error al cargar el historial de compras:', historialError);
    // Puedes optar por mostrar un mensaje o continuar sin el historial
  }

  // Obtener todos los IDs de productos que el usuario ya ha comprado
  const productosCompradosPrevios = historialData?.ObtenerHistorialPorUsuario?.reduce((acc, historial) => {
    return acc.concat(historial.idProductos);
  }, []) || [];

  // Función para añadir un producto al carrito
  const AddCarritoFunc = async (id) => {
    const idUsuarioActual = ExtraerIdUsuario();
    if (!idUsuarioActual) return; // No ejecutar si no hay usuario

    // Verificar si el producto ya ha sido comprado
    if (productosCompradosPrevios.includes(id)) {
      Tostadas.ToastWarning("Este producto ya ha sido comprado anteriormente y no puede ser añadido al carrito.", 3000);
      return;
    }

    setLoadingProduct(id); // Establecer el producto que está añadiendo

    try {
      Tostadas.ToastInfo("Añadiendo producto al carrito...", 1000);

      const prevCartItems = [...cartItems]; // Guardar el cartItems anterior
      const { data } = await agregarProducto({
        variables: {
          IDUsuario: idUsuarioActual,
          IDProducto: id,
        },
      });

      setCartItems(data.AgregarProducto.idProductos);

      console.log(`Producto ${id} añadido al carrito`);

      if (prevCartItems.length === cartItems.length && prevCartItems.includes(id)) {
        Tostadas.ToastWarning("Este producto ya estaba en el carrito", 2000);
      } else {
        Tostadas.ToastSuccess("Producto añadido al carrito", 2000);
      }
    } catch (error) {
      Tostadas.ToastError("Ocurrió un error al agregar el producto al carrito");
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
      <ToastContainer />
    </div>
  );
}

export default ProductGrid;
