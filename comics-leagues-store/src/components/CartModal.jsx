import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { cartClient, productClient } from '../apolloClient';
import { Button } from "@nextui-org/react";

const CURSOS_POR_ID = gql`
  query CursosPorId($ids: [ID!]!, $userId: ID!) {
    cursosPorId(ids: $ids, userId: $userId) {
      id
      nombre
      descripcion
      precio
      imagen
      categoria
      nivel
      puntuacion
    }
  }
`;

const ELIMINAR_PRODUCTO = gql`
  mutation EliminarProducto($input: EliminarProductoInput!) {
    EliminarProducto(input: $input) {
      id
      idUsuario
      idProductos
    }
  }
`;

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const ExtraerIdUsuario = () => {
  if (isAuthenticated()) {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id || null;
  } else {
    return null;
  }
};

const userId = ExtraerIdUsuario();

export const CartModal = ({ isOpen, closeModal, cartItems }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [productDetails, setProductDetails] = useState([]);
  // Query para obtener los detalles de los productos en el carrito usando cartItems directamente
  const { refetch: refetchProductDetails } = useQuery(CURSOS_POR_ID, {
    variables: { ids: cartItems, userId },
    skip: cartItems.length === 0 || !userId,
    client: productClient,
    onCompleted: (data) => {
      if (data && data.cursosPorId) {
        setProductDetails(data.cursosPorId);
      }
    },
    onError: (error) => {
      setErrorMessage('Error al cargar los detalles de los productos.');
      console.error('Detalles del error:', error);
    },
  });

  // Mutation para eliminar un producto del carrito
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    onCompleted: (data) => {
      const updatedCartData = data.EliminarProducto.idProductos;
      refetchProductDetails({ ids: updatedCartData, userId }); // Refresca los detalles de los productos
      setErrorMessage(''); // Limpia cualquier mensaje de error después de una eliminación exitosa
    },
    onError: (error) => {
      setErrorMessage('Error al eliminar el producto.');
      console.error('Detalles del error:', error);
    },
  });

  // Función para eliminar un producto del carrito
  const handleEliminarProducto = (idProducto) => {
    eliminarProducto({
      variables: {
        input: { IDUsuario: userId, IDProducto: idProducto },
      },
      client: cartClient,
    });
  };

  // Vaciar carrito en caso de cerrar sesión
  useEffect(() => {
    const handleUserLoggedOut = () => {
      setProductDetails([]);
      setErrorMessage("Carrito vacío al cerrar sesión.");
    };

    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  if (!isOpen) return null;

  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-200 max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>

        {productDetails.length > 0 ? (
          <ul className="space-y-4 flex-auto">
            {productDetails.map((product) => (
              <li key={product.id} className="flex items-center p-4 border-b border-gray-200">
                <div className="flex-shrink-0">
                  <img src={product.imagen} alt={product.nombre} className="w-16 h-16 rounded-lg shadow-md" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-medium text-gray-800">{product.nombre}</h3>
                  <p className="text-sm text-gray-500">{product.descripcion}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-cyan-600">${product.precio}</span>
                </div>

                <Button className="ml-4 px-2 py-1" color="danger" onClick={() => handleEliminarProducto(product.id)}>
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">El carrito está vacío.</p>
        )}

        <div className="mt-5 flex justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
          <Link
            to="/paySystem"
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            onClick={closeModal}
          >
            Ir a Pagar
          </Link>
        </div>
      </div>
    </div>
  );
};
