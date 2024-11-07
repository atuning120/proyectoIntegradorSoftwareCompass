import { useEffect, useState } from "react";
import {CircularProgress} from "@nextui-org/react";

const isAuthenticated = () => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.log("Error buscando el token: ", error);
        return undefined;
    }
};


const SetPerfil = () =>{
    const [userObj, setUserObj] = useState(null);

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [username, setUsername] = useState('');
    const [correo, setCorreo] = useState('');
    const [loading,setLoading] = useState(true);

    const token = isAuthenticated();

    useEffect(() =>{
        if(token){
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                setUserObj(user);
                if (user) {
                    setNombre(user.nombre);
                    setApellido(user.apellido);
                    setUsername(user.username);
                    setCorreo(user.correo);
                }
                else{
                    console.log("no hay errores pero tampoco hay datos xd");
                }


            } catch (error) {
                console.error("que paso aca: "+error);
            }
            finally{
                setLoading(false);
            }

        }

    },[token]);//se ejecuta 'useEffect(()=>{})'cada vez que el token cambie
    
    if(loading){
        return <CircularProgress aria-label="Loading..."/>;
    }

    if(!token || !userObj){
        return (<h1 className="flex justify-center text-3xl text-red-600">ERROR: Falta iniciar sesion</h1>);//return corta la funcion aqui
    }



    const handleEnviarCambios = () =>{
        console.log("Estos datos se enviarian: ");
        console.log("nombre: "+nombre);
        console.log("apellido: "+apellido);
        console.log("username: "+username);
        console.log("correo: "+correo);
    };


    return(
    <div className="mt-8 p-4 flex justify-center mr-16">
        <div className="w-[60%] bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-28">Modificar datos</h1>
            <input className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6" 
            placeholder={`Nombre: ${userObj.nombre || ''}`}
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            >
            </input>

            <input className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6" 
            placeholder={`Apellido: ${userObj.apellido || ''}`}
            value={apellido}
            onChange={(evento) => setApellido(evento.target.value)}
            >
            </input>

            <input className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6" 
            placeholder={`Alias: ${userObj.username || ''}`}
            value={username}
            onChange={(evento) => setUsername(evento.target.value)}
            >
            </input>

            <input className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6" 
            placeholder={`Correo: ${userObj.correo || ''}`}
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            >
            </input>

            <button className="bg-gray-900 hover:bg-gray-950 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out relative" onClick={handleEnviarCambios}>
                Guardar Cambios
            </button>

        </div>
    </div>
    );
};
export default SetPerfil;