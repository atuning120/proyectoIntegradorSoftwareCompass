import React, { useEffect, useState } from 'react';
import { cartClient, productClient } from '../apolloClient'; // Ajusta la ruta según tu estructura
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Checkbox } from "@nextui-org/react";
import {paymentClient} from '../axiosClient.jsx';

const OBTENER_CARRITO = gql`
  query ObtenerCarrito($id: ID!) {
    ObtenerCarrito(id: $id) {
      id
      idUsuario
      idProductos
    }
  }
`;

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
    return user.id;
  } else {
    console.warn('Usuario no autenticado');
    return null;
  }
};

// Define una constante exportable para los productos seleccionados
export let productosSeleccionados = [];

const PaySystem = () => {
  const [cartData, setCartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [productDetails, setProductDetails] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Estado para productos seleccionados
  const [totalPrice, setTotalPrice] = useState(0); // Estado para el total a pagar

  // Extraer el id del usuario
  const userId = ExtraerIdUsuario();

  // Obtener el carrito del usuario
  const { data, error, refetch: refetchCart } = useQuery(OBTENER_CARRITO, {
    variables: { id: userId },
    skip: !userId,
    client: cartClient,
    onCompleted: (data) => {
      if (data && data.ObtenerCarrito) {
        setCartData(data.ObtenerCarrito.idProductos);
      }
    },
    onError: (error) => {
      console.error('Error al cargar el carrito:', error);
      setErrorMessage('Error al cargar el carrito.');
    },
  });

  // Obtener los detalles de los productos
  const { refetch: refetchProductDetails } = useQuery(CURSOS_POR_ID, {
    variables: { ids: cartData, userId },
    skip: cartData.length === 0 || !userId,
    client: productClient,
    onCompleted: (data) => {
      if (data && data.cursosPorId) {
        setProductDetails(data.cursosPorId);
      }
    },
    onError: (error) => {
      console.error('Error al cargar los productos:', error);
      setErrorMessage('Error al cargar los productos.');
    },
  });

  // Eliminar producto del carrito
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    onCompleted: (data) => {
      if (data && data.EliminarProducto) {
        const updatedCart = data.EliminarProducto.idProductos;
        setCartData(updatedCart);
        refetchProductDetails({ ids: updatedCart, userId });
      }
    },
    onError: (error) => {
      console.error('Error al eliminar producto:', error);
      setErrorMessage('Error al eliminar el producto.');
    },
  });

  // Manejar eliminación de producto
  const handleEliminarProducto = (productId) => {
    eliminarProducto({
      variables: {
        input: { IDUsuario: userId, IDProducto: productId },
      },
      client: cartClient,
    });
  };

  // Manejar selección de producto
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.includes(productId);
      const updatedSelection = isSelected
        ? prevSelected.filter((id) => id !== productId) // Desmarcar
        : [...prevSelected, productId]; // Marcar
      productosSeleccionados = updatedSelection; // Actualizar constante exportable
      calculateTotalPrice(updatedSelection); // Recalcular el precio total
      return updatedSelection;
    });
  };

  // Calcular el precio total
  const calculateTotalPrice = (selectedIds) => {
    const total = productDetails
      .filter((product) => selectedIds.includes(product.id))
      .reduce((sum, product) => sum + product.precio, 0);
    setTotalPrice(total);
  };

  // Limpiar el carrito al cerrar sesión
  useEffect(() => {
    const handleUserLoggedOut = () => {
      setCartData([]);
      setProductDetails([]);
      setSelectedProducts([]);
      setTotalPrice(0); // Reiniciar total
    };

    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  if (error) {
    return <p>{errorMessage || 'Error al cargar los datos.'}</p>;
  }
// Agrega esta función en tu componente
const iniciarPago = async () => {
  if (totalPrice <= 0) {
    alert('No puedes procesar un pago con un total de $0.');
    return;
  }

  try {
    // Realizar la solicitud de pago con solo el monto total
    const amountInCents = Math.round(totalPrice);
    const response = await paymentClient.post('/api/pagos/create', {
      amount: amountInCents, // Solo envía el monto total
    });

    // Verificar si la respuesta contiene una URL de pago
    const { paymentUrl } = response.data;

    if (paymentUrl) {
      // Redirigir al usuario a la página de pago
      window.location.href = paymentUrl;
    } else {
      throw new Error('La URL de pago no fue proporcionada por el servidor.');
    }
  } catch (error) {
    console.error('Error al iniciar el pago:', error);
    alert(
      'Hubo un problema al procesar el pago. Por favor, verifica tu conexión a internet o intenta de nuevo más tarde.'
    );
  }
};
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>

      {productDetails.length > 0 ? (
        <ul className="space-y-4 flex-auto">
          {productDetails.map((product) => (
            <li key={product.id} className="flex items-center p-4 border-b border-gray-200">
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleCheckboxChange(product.id)}
              />
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

      <div className="mt-5">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-medium">Total a pagar:</span>
          <span className="text-lg font-semibold text-cyan-600">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          disabled={selectedProducts.length === 0}
          onClick={iniciarPago}
        >
          Ir a Pagar
        </button>
      </div>
    </div>
  );
};

export default PaySystem;
