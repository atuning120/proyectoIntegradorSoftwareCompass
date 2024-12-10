import { gql, useQuery } from "@apollo/client";
import { productClient } from "../apolloClient";
import { CircularProgress } from "@nextui-org/react";
import { FaStar } from 'react-icons/fa'; // Star icon for ratings

// GraphQL Query
const GET_PRODUCT_BY_ID = gql`
    query cursosgraph($ids: [ID!]!, $userId: ID!){
        cursosPorId(ids:$ids,userId:$userId){
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

const RenderProduct = ({ ids, userId }) => {
    const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
        variables: { ids, userId },
        client: productClient,
    });

    if (loading) return <CircularProgress aria-label="Cargando..." />;
    if (error) return <p className="text-red-500">ERROR: {error.message}</p>;
    if (!data || !data.cursosPorId) return <p className="font-semibold text-lg">Producto no encontrado</p>;

    const product = data.cursosPorId[0];
    
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="overflow-hidden rounded-lg shadow-md">
                    <img 
                        src={product.imagen} 
                        alt={`Imagen: ${product.nombre}`} 
                        className="w-full max-w-[150px] h-auto object-cover rounded-lg transform transition translate-y-10 duration-300 hover:scale-105 mx-auto"
                    />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-semibold text-gray-800">{product.nombre}</h2>
                    <p className="text-sm text-gray-500">{product.categoria}</p>
                    <p className="text-gray-700">{product.descripcion}</p>

                    {/* Price & Rating */}
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-green-600">${product.precio}</p>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} color={index < product.puntuacion ? "#FFD700" : "#D3D3D3"} className="w-5 h-5" />
                            ))}
                            <span className="ml-2 text-gray-600">{product.puntuacion}</span>
                        </div>
                    </div>

                    {/* Product Level */}
                    <p className="text-sm text-gray-500">{product.nivel}</p>
                </div>
            </div>
        </div>
    );
};

export default RenderProduct;
