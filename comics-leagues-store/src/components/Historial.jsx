import { useQuery,gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { historialClient, productClient } from "../apolloClient";
import RenderProduct from "./RenderProduct";
import { CircularProgress } from "@nextui-org/react";

const getHistoryByUserID = gql`
query getHistory($idUsuario: ID!){
  ObtenerHistorialPorUsuario(idUsuario: $idUsuario){
        id
        idUsuario
        fecha
        idProductos
  }
}
`

const isAuthenticated = () => {
  try {
      return localStorage.getItem('token');
  } catch (error) {
      console.log("Error buscando el token: ", error);
      return undefined;
  }
};


const Historial = () =>{
    const [historiales,setHistoriales] = useState(null);
    const [isAscending, setIsAscending] = useState(true);
    const token = isAuthenticated();
    if(!token){
      return <p>ERROR: no hay token, vuelve a iniciar sesion</p>;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id

    const {loading,error, data} = useQuery(getHistoryByUserID,{
      variables: {idUsuario: userId},
      client: historialClient,
    })
      
    useEffect(() =>{
      console.log("cambios en data...?")
      if(data){
        setHistoriales(data.ObtenerHistorialPorUsuario);
      }
    },[data])

    
    const toggleSortOrder = () => {
      setIsAscending(prev => {
          const ordenados = [...historiales].sort((a, b) => {
              if (prev) {
                  return new Date(b.fecha) - new Date(a.fecha); // Descendente
              } else {
                  return new Date(a.fecha) - new Date(b.fecha); // Ascendente
              }
          });
          setHistoriales(ordenados);
          return !prev; // Actualiza el estado de forma consistente
      });
  };
  

    

    if (loading) return <CircularProgress aria-label="Cargando..." />;
    if (error) return <div>Error al cargar el historial</div>;
    

    return(
        <div className="ml-72">
            <h1 className="text-gray-700 font-semibold text-3xl ml-8 mb-12">
                Historial de compras
            </h1>
            <button
              onClick={toggleSortOrder}
              className="mb-4 bg-gray-950 text-white px-4 py-2 rounded-md active:font-extrabold hover:bg-gray-900"
            >
              Ordenar por fecha
            </button>
            {data && historiales && historiales.length > 0 && historiales.map((historialActual,index)=>{
                return(
                    <div key={index} className="ml-8 mb-6">
                        {historialActual.idProductos.map((productoActualID,index2) => {
                            return(
                                <RenderProduct
                                    key={index2}
                                    ids={[productoActualID]}
                                    userId={historialActual.idUsuario}
                                />
                            );
                        })}
                        <p className="mb-4">Fecha de compra: {historialActual.fecha}</p>
                    </div>
                );
            })}
        </div>
    );
};
export default Historial;