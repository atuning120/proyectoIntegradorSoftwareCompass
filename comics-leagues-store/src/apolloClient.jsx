import { ApolloClient, InMemoryCache } from '@apollo/client';

//agrega 'userClient' en el gql si usaras ms-usuario como destino de la consulta
const userClient = new ApolloClient({
  uri: 'http://localhost:3002/usuario', 
  cache: new InMemoryCache(),
});

//agrega 'productClient' en el gql si usaras ms-producto como destino de la consulta
const productClient = new ApolloClient({
  uri: 'http://localhost:3002/producto', // Cambia según tu configuración
  cache: new InMemoryCache(),
});

//agrega 'cartClient' en el gql si usaras ms-carrito como destino de la consulta
const cartClient = new ApolloClient({
  uri: 'http://localhost:3002/carrito',
  cache: new InMemoryCache(),
});

const historialClient = new ApolloClient({
  uri: 'http://localhost:3002/historial',
  cache: new InMemoryCache(),
});

export { userClient, cartClient, productClient ,historialClient};
