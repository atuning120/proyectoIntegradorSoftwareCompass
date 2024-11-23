import React, { createContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { cartClient } from '../apolloClient';

const OBTENER_CARRITO = gql`
  query ObtenerCarrito($id: ID!) {
    ObtenerCarrito(id: $id) {
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
    return user.id;
  } else {
    console.warn('Usuario no autenticado');
    return null;
  }
};

// Crear el contexto
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const userId = ExtraerIdUsuario();

  const { data, error } = useQuery(OBTENER_CARRITO, {
    variables: { id: userId },
    skip: !userId, // No hacer la consulta si no hay usuario
    client: cartClient,
  });

  useEffect(() => {
    if (data?.ObtenerCarrito) {
      setCartItems(data.ObtenerCarrito.idProductos);
    }
  }, [data]);

  if (error) {
    console.error('Error al cargar el carrito:', error);
  }

  // Proveer funciones y estado
  // esto envolvera al router, para que cualquier componente pueda llamar a CartContext y tomar datos del carrito
  // sin tener que pasar props
  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
