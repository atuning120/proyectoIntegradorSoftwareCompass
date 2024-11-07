import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Image, CircularProgress } from "@nextui-org/react";
import { productClient, cartClient } from '../apolloClient';

// Definir la query GraphQL
const GET_CURSOS = gql`
  query GetCursos {
    cursos {
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

const CursosPage = () => {
  const { loading, error, data } = useQuery(GET_CURSOS, { client: productClient });
  const [agregarProducto] = useMutation(AGREGAR_PRODUCTO, { client: cartClient });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loadingProduct, setLoadingProduct] = useState(null);

  // Manejar el cambio de filtros
  const handleFilterChange = (e) => setSelectedCourse(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleLevelChange = (e) => setSelectedLevel(e.target.value);
  const handleSortOrderChange = (e) => setSortOrder(e.target.value);

  // Función para añadir un producto al carrito
  const AddCarritoFunc = async (id) => {
    const idUsuario = ExtraerIdUsuario();
    if (!idUsuario) return; // No ejecutar si no hay usuario

    setLoadingProduct(id); // Establecer el producto que está añadiendo

    try {
      await agregarProducto({
        variables: {
          IDUsuario: idUsuario,
          IDProducto: id,
        },
      });
      console.log(`Producto ${id} añadido al carrito`);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    } finally {
      setLoadingProduct(null); // Restablecer el estado de carga
    }
  };

  if (loading) return <CircularProgress aria-label="Loading..." />;
  if (error) return <p>Error al cargar los cursos: {error.message}</p>;

  const products = data.cursos;

  const filteredProducts = products
    .filter((product) => (selectedCourse ? product.nombre === selectedCourse : true))
    .filter((product) => (selectedCategory ? product.categoria === selectedCategory : true))
    .filter((product) => (selectedLevel ? product.nivel === selectedLevel : true))
    .sort((a, b) => {
      if (sortOrder === 'priceAsc') return a.precio - b.precio;
      if (sortOrder === 'priceDesc') return b.precio - a.precio;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Filtro de búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Filtrar por cursos*/}
        <label htmlFor="courseFilter" className="p-4 text-lg font-medium text-gray-700">
          Filtrar por Curso:
          <select
            id="courseFilter"
            value={selectedCourse}
            onChange={handleFilterChange}
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todos los cursos</option>
            {products.map((product) => (
              <option key={product.id} value={product.nombre}>
                {product.nombre}
              </option>
            ))}
          </select>
        </label>

        {/* Filtrar por Categoria*/}
        <label htmlFor="categoryFilter" className="p-4 text-lg font-medium text-gray-700">
          Filtrar por Categoria:
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todas las categorias</option>
            {[...new Set(products.map((product) => product.categoria))].map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </label>

        {/* Filtrar por nivel*/}
        <label htmlFor="levelFilter" className="p-4 text-lg font-medium text-gray-700">
          Filtrar por Nivel:
          <select
            id="levelFilter"
            value={selectedLevel}
            onChange={handleLevelChange}
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todos los niveles</option>
            {[...new Set(products.map((product) => product.nivel))].map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </label>

        {/* Filtrar precio*/}
        <label htmlFor="sortOrder" className="p-4 text-lg font-medium text-gray-700">
          Filtrar por precio:
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Sin ordenar</option>
            <option value="priceAsc">Precio Ascendente</option>
            <option value="priceDesc">Precio Descendente</option>
          </select>
        </label>
      </div>

      {/* Mostrar cursos filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            {/* Contenido superior */}
            <div className="flex-grow">
              <Image
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{product.nombre}</h3>
              <p className="text-gray-600">{product.descripcion}</p>
              <p className="text-gray-600">
                {product.categoria} - {product.nivel}
              </p>
            </div>

            {/* Contenedor de precio y botón, siempre alineados al fondo */}
            <div className="mt-auto">
              <div className="mt-4">
                <span className="text-xl font-bold">
                  ${product.precio.toLocaleString('es-ES')}
                </span>
              </div>
              <button
                onClick={() => AddCarritoFunc(product.id)}
                className="mt-2 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
                disabled={loadingProduct === product.id}
              >
                {loadingProduct === product.id ? 'Añadiendo...' : 'Añadir al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CursosPage;
