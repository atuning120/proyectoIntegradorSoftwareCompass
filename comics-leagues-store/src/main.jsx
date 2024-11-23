import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ApolloProvider } from '@apollo/client'; // Importa Apollo Provider
import {userClient, productClient, cartClient} from './apolloClient'; // Importa Apollo Client configurado
import {NextUIProvider} from "@nextui-org/react";
import { CartProvider } from './context/CartContext'; //context es usado para tener acceso global a 'cartItems'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={productClient}>
      <CartProvider>
        <NextUIProvider>
          <RouterProvider router={router} />
        </NextUIProvider>
      </CartProvider>
    </ApolloProvider>
  </React.StrictMode>
);