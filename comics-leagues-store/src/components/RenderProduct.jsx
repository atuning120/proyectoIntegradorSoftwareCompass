import { gql, useQuery } from "@apollo/client";
import { productClient } from "../apolloClient";
import { CircularProgress } from "@nextui-org/react";



//llamar a este componente pasandole productId,userId, hara una llamada gql y renderizara el contenido
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
`

const RenderProduct = ({ids,userId}) =>{
    const {loading,error,data} = useQuery(GET_PRODUCT_BY_ID,{
        variables: {ids,userId},
        client: productClient,
    });
    if (loading) return <CircularProgress aria-label="Cargando..." />; 
    if (error) return <p>ERROR: {error.message}</p>;
    if (!data || !data.cursosPorId) return <p className="font-semibold">Producto no encontrado</p>;


    return (
        <div>
            <h2>{data.cursosPorId[0].nombre}</h2>
            <p>{data.cursosPorId[0].descripcion}</p>
            <img src={data.cursosPorId[0].imagen} alt={`Imagen: ${data.cursosPorId.nombre}`} />
            <p>Precio: ${data.cursosPorId[0].precio}</p>
            <p>Categoría: {data.cursosPorId[0].categoria}</p>
            <p>Nivel: {data.cursosPorId[0].nivel}</p>
            <p>Puntuación: {data.cursosPorId[0].puntuacion}</p>
        </div>
      );
};

export default RenderProduct