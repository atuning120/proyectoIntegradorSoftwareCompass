// PaySystem.jsx
import React, { useEffect, useState, useRef } from 'react';
import { cartClient, productClient, historialClient } from '../apolloClient'; 
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Checkbox } from "@nextui-org/react";
import { paymentClient } from '../axiosClient.jsx';
import { useLocation } from 'react-router-dom'; 

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

const CREAR_HISTORIAL = gql`
  mutation CrearHistorial($idUsuario: ID!, $idProductos: [ID!]!) {
    crearHistorial(idUsuario: $idUsuario, idProductos: $idProductos) {
      id
      idUsuario
      fecha
      idProductos
    }
  }
`;

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

export let productosSeleccionados = [];

const PaySystem = () => {
  const [cartData, setCartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [productDetails, setProductDetails] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false); 
  const tokenProcessed = useRef(false);
  const location = useLocation();

  const userId = ExtraerIdUsuario();

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

  const { data: historialData, error: historialError, loading: historialLoading } = useQuery(OBTENER_HISTORIAL_POR_USUARIO, {
    variables: { idUsuario: userId },
    skip: !userId,
    client: historialClient,
    onError: (error) => {
      console.error('Error al cargar el historial de compras:', error);
      setErrorMessage('Error al cargar el historial de compras.');
    },
  });

  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    client: cartClient,
    onError: (error) => {
      console.error('Error al eliminar producto:', error);
      setErrorMessage('Error al eliminar el producto.');
    },
  });

  const [crearHistorialMutation] = useMutation(CREAR_HISTORIAL, {
    client: historialClient,
    onError: (error) => {
      console.error('Error al crear historial:', error);
      setErrorMessage('Error al crear historial de compras.');
    },
  });

  const handleEliminarProducto = (productId) => {
    eliminarProducto({
      variables: {
        input: { IDUsuario: userId, IDProducto: productId },
      },
    });
    window.location.reload();
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.includes(productId);
      const updatedSelection = isSelected
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId];
      productosSeleccionados = updatedSelection; 
      calculateTotalPrice(updatedSelection);
      return updatedSelection;
    });
  };

  const calculateTotalPrice = (selectedIds) => {
    const total = productDetails
      .filter((product) => selectedIds.includes(product.id))
      .reduce((sum, product) => sum + product.precio, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    const handleUserLoggedOut = () => {
      setCartData([]);
      setProductDetails([]);
      setSelectedProducts([]);
      setTotalPrice(0);
      localStorage.removeItem('aComprar');
    };

    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  if (error || historialError) {
    return <p>{errorMessage || 'Error al cargar los datos.'}</p>;
  }

  const iniciarPago = async () => {
    if (totalPrice <= 0) {
      alert('No puedes procesar un pago con un total de $0.');
      return;
    }

    if (historialLoading) {
      alert('Cargando historial de compras. Por favor, espera un momento.');
      return;
    }

    const productosCompradosPrevios = historialData?.ObtenerHistorialPorUsuario?.reduce((acc, historial) => {
      return acc.concat(historial.idProductos);
    }, []) || [];

    const productosYaComprados = selectedProducts.filter(productId => productosCompradosPrevios.includes(productId));

    if (productosYaComprados.length > 0) {
      alert('No puedes comprar los mismos productos más de una vez. Los siguientes productos ya han sido comprados: ' + productosYaComprados.join(', '));
      return;
    }

    try {
      setLoading(true);
      localStorage.removeItem('aComprar');
      localStorage.setItem('aComprar', JSON.stringify(selectedProducts));
      const amountInCents = Math.ceil(totalPrice);
      const response = await paymentClient.post('/api/pagos/create', {
        amount: amountInCents,
      });

      const { paymentUrl } = response.data;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('La URL de pago no fue proporcionada por el servidor.');
      }
    } catch (error) {
      console.error('Error al iniciar el pago:', error);
      alert('Hubo un problema al procesar el pago. Por favor, verifica tu conexión a internet o intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenWs = params.get('token_ws');

    if (tokenWs && !tokenProcessed.current) {
      const valor = JSON.parse(localStorage.getItem('aComprar'));
      console.log(valor);
      tokenProcessed.current = true; 
      confirmarPago(tokenWs, valor);
    }
  }, [location.search]);

  const confirmarPago = async (tokenWs, productosComprados) => {
    setLoading(true);
    try {
      const response = await paymentClient.get(`/api/pagos/commit?token_ws=${tokenWs}`);
      const { commitResponse } = response.data;

      if (commitResponse && commitResponse.response_code === 0) {
        setPaymentStatus('Pago realizado con éxito. Gracias por tu compra.');

        if (userId && productosComprados && productosComprados.length > 0) {
          // 1. Eliminar los productos comprados del carrito
          const eliminarPromesas = productosComprados.map((productId) =>
            eliminarProducto({
              variables: {
                input: { IDUsuario: userId, IDProducto: productId },
              },
            })
          );

          // Esperar a que todas las eliminaciones se completen
          await Promise.all(eliminarPromesas);

          // 2. Refetch el carrito y los detalles de los productos
          await refetchCart();
          await refetchProductDetails({ ids: cartData, userId });

          // 3. Crear una entrada en el historial de compras
          await crearHistorialMutation({
            variables: {
              idUsuario: userId,
              idProductos: productosComprados,
            },
          });

          // 4. Limpiar la lista 'aComprar' de localStorage
          localStorage.removeItem('aComprar');

          // 5. Resetear estados locales
          setSelectedProducts([]);
          productosSeleccionados = [];
          setTotalPrice(0);
          window.location.reload()
        }
      } else {
        setPaymentStatus('No se pudo completar el pago. Por favor, inténtalo de nuevo.');
        alert('No se pudo completar el pago. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al confirmar el pago:', error);
      setPaymentStatus('Hubo un problema al confirmar el pago. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
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
                <span className="text-lg font-semibold text-cyan-600">${product.precio.toFixed(2)}</span>
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

      {paymentStatus && (
        <div className={`mt-4 p-4 rounded-md ${paymentStatus.includes('éxito') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {paymentStatus}
        </div>
      )}

      {loading && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          Procesando tu pago...
        </div>
      )}
    </div>
  );
};

export default PaySystem;
