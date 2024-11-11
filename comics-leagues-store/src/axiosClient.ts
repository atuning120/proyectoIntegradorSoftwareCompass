import axios from 'axios';

// Configuración para la API de pago
const paymentClient = axios.create({
    baseURL: 'http://localhost:3001/create',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  export {paymentClient };