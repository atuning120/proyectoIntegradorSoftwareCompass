// axiosClient.jsx
import axios from 'axios';

// Configuración básica de Axios
const paymentClient = axios.create({
  baseURL: 'http://localhost:3001', // Cambia esto a la URL de tu backend
  timeout: 10000, // Tiempo límite para las solicitudes
  headers: {
    'Content-Type': 'application/json', // Encabezado para JSON
  },
});

// Interceptor para añadir un token de autorización si es necesario
paymentClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado
    }
    return config;
  },
  (error) => {
    // Manejo de errores antes de que se envíen las solicitudes
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
paymentClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Manejar errores 401 (no autorizado)
      console.error('No autorizado, redirigiendo a inicio de sesión...');
      window.location.href = '/login'; // Redirige al inicio de sesión si es necesario
    }
    return Promise.reject(error);
  }
);

export { paymentClient };
