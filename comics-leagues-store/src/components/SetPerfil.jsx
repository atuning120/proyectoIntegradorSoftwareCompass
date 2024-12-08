import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { useMutation, gql } from '@apollo/client';
import { userClient } from '../apolloClient';
import { useNavigate } from 'react-router-dom';
import Tostadas from './Tostadas';
import { ToastContainer } from "react-toastify";


//verificar si el usuario esta autenticado
const isAuthenticated = () => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.log("Error buscando el token: ", error);
        return undefined;
    }
};

const isEmptyOrWhitespace = (str) => {
    return !str.trim();//quita todos los " " del string 
  };

// Función para cerrar sesión
const logout = () => {
    window.dispatchEvent(new Event('userLoggedOut'));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const MODIFICAR_NOMBRE = gql`
  mutation modificarUsuarioNombre($idUsuario: String!, $input: ModificarNombre!) {
    modificarUsuarioNombre(idUsuario: $idUsuario, input: $input) {
      id
      nombre
    }
  }
`;

const MODIFICAR_APELLIDO = gql`
  mutation modificarUsuarioApellido($idUsuario: String!, $input: ModificarApellido!) {
    modificarUsuarioApellido(idUsuario: $idUsuario, input: $input) {
      apellido
    }
  }
`;

const MODIFICAR_USERNAME = gql`
  mutation modificarUsuarioUserName($idUsuario: String!, $input: ModificarUserName!) {
    modificarUsuarioUserName(idUsuario: $idUsuario, input: $input) {
      username
    }
  }
`;

const MODIFICAR_CORREO = gql`
  mutation modificarUsuarioCorreo($idUsuario: String!, $input: ModificarCorreo!) {
    modificarUsuarioCorreo(idUsuario: $idUsuario, input: $input) {
      correo
    }
  }
`;

const SetPerfil = () => {
    const [userObj, setUserObj] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [username, setUsername] = useState('');
    const [correo, setCorreo] = useState('');
    const [loading, setLoading] = useState(true);

    const token = isAuthenticated();
    const navigate = useNavigate(); //hook de react-router-dom para redirigir

    // Llamadas a gql para cada atributo
    const [modificarNombre] = useMutation(MODIFICAR_NOMBRE, { client: userClient });
    const [modificarApellido] = useMutation(MODIFICAR_APELLIDO, { client: userClient });
    const [modificarUsername] = useMutation(MODIFICAR_USERNAME, { client: userClient });
    const [modificarCorreo] = useMutation(MODIFICAR_CORREO, { client: userClient });

    useEffect(() => {
        if (token) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                setUserObj(user);
                if (user) {
                    setNombre(user.nombre);
                    setApellido(user.apellido);
                    setUsername(user.username);
                    setCorreo(user.correo);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [token]);

    if (loading) {
        return <CircularProgress aria-label="Cargando..." />;
    }


    const handleLogout = () => {
        logout(); // Cierra la sesión

        //mostramos el toast(alerta lateral de color verde)
        Tostadas.ToastSuccess('Tus datos han cambiado. Vuelve a iniciar sesión.');
        setTimeout(() => {
            navigate('/'); //redirige al home
        }, 2000); //2 segundos
    };

    const handleEnviarCambios = async () => {
        let hasChanged = false;
        try {
            if(isEmptyOrWhitespace(nombre) || isEmptyOrWhitespace(apellido) || 
            isEmptyOrWhitespace(username) || isEmptyOrWhitespace(correo))  {
                Tostadas.ToastWarning("No intentes enviar campos vacíos");
                return;
            }
            if (nombre !== userObj.nombre) {
                await modificarNombre({ variables: { idUsuario: userObj.id, input: { nombre } } });
                hasChanged = true;
            }
            if (apellido !== userObj.apellido) {
                await modificarApellido({ variables: { idUsuario: userObj.id, input: { apellido } } });
                hasChanged = true;
            }
            if (correo !== userObj.correo) {
                await modificarCorreo({ variables: { idUsuario: userObj.id, input: { correo } } });
                hasChanged = true;
            }
            if (username !== userObj.username) {
                await modificarUsername({ variables: { idUsuario: userObj.id, input: { username } } });
                hasChanged = true;
            }
        } catch (error) {
            console.error("Error modificando datos:", error);
            Tostadas.ToastError("Error modificando datos:", error);
        } finally {
            if (hasChanged) {
                handleLogout(); // Llamamos a handleLogout que maneja el toast y la redirección
            }
            else{
                Tostadas.ToastInfo('No hubo cambios en tus datos.');
            }
        }
    };

    return (
        <div className="mt-8 p-4 flex justify-center mr-16">
            <div className="w-[60%] bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-28">Modificar datos</h1>
                <input
                    className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6"
                    placeholder={`Nombre: ${userObj.nombre || ''}`}
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                />
                <input
                    className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6"
                    placeholder={`Apellido: ${userObj.apellido || ''}`}
                    value={apellido}
                    onChange={(evento) => setApellido(evento.target.value)}
                />
                <input
                    className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6"
                    placeholder={`Alias: ${userObj.username || ''}`}
                    value={username}
                    onChange={(evento) => setUsername(evento.target.value)}
                />
                <input
                    className="w-[450px] text-2xl relative hover:bg-gray-200 rounded-sm mb-6"
                    placeholder={`Correo: ${userObj.correo || ''}`}
                    value={correo}
                    onChange={(evento) => setCorreo(evento.target.value)}
                />
                <button
                    className="bg-gray-900 hover:bg-gray-950 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out relative active:font-extrabold"
                    onClick={handleEnviarCambios}
                >
                    Guardar Cambios
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default SetPerfil;