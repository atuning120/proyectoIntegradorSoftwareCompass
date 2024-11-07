import { useState , useEffect} from "react";
import {CircularProgress} from "@nextui-org/react";


const isAuthenticated = () =>{
    try {
        const token = localStorage.getItem('token');
        return token;
    } catch (error) {
        console.log("error mientras se busca el token: ",error);
        return undefined;
    }
};

const Perfil = () =>{
    const [user,setUser] = useState('');
    const token = isAuthenticated();
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        try {
            if (token) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    console.error("No user data found in local storage.");
                }
            } else {
                console.error("User is not authenticated.");
            }
            
        } catch (error) {
            console.error("ERROR: "+error);
        } finally {
            setLoading(false);
        }

    }, [token]);

    if(loading){
        return <CircularProgress aria-label="Loading..."/>;
    }

    if (!user) {
        return (<h1 className="flex justify-center text-3xl text-red-600">ERROR: Falta iniciar sesion</h1>);
    }
    return (
        <div className="mt-8 p-4 flex justify-center mr-16">
            <div className="w-[60%] bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold mb-28">Perfil de usuario</h1>
                <p className="text-2xl text-black mb-4">Nombre: {user.nombre}</p>
                <p className="text-2xl text-black mb-4">Apellido: {user.apellido}</p>
                <p className="text-2xl text-black mb-4">Nombre de usuario: {user.username}</p>
                <p className="text-2xl text-black mb-4">Correo: {user.correo}</p>
            </div>
        </div>
    );
    
};

export default Perfil;