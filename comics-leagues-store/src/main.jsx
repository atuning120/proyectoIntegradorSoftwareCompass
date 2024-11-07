import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ApolloProvider } from '@apollo/client'; // Importa Apollo Provider
import {userClient, productClient, cartClient} from './apolloClient'; // Importa Apollo Client configurado
import {NextUIProvider} from "@nextui-org/react";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={productClient}>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </ApolloProvider>
  </React.StrictMode>
);