import React, { useState } from 'react';
import '../index.css';
import Signup from './Signup';
import '../animations.css';
import {Link} from 'react-router-dom'
import BackButton from '../components/BackButton';
import { useNavigate } from 'react-router-dom'; // Hook para la navegación
import { useMutation, gql } from '@apollo/client';
import {userClient} from '../apolloClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        nombre
        apellido
        username
        correo
      }
    }
  }
`;

//Para acceder a los datos del usuario desde cualquier componentes del front
//const token = localStorage.getItem('token');
//const user = JSON.parse(localStorage.getItem('user'));
//console.log(user);


const isAuthenticated = () => {
	const token = localStorage.getItem('token');
  if(token){
    return true;
  }
	return false;
};

const getGradientClass = (errors,hasRespOK) =>{
  if(errors.length === 0 && hasRespOK === true){
    /*no error and backend said OK*/
    return `bg-gradient-to-tr from-green-300 to-blue-800`;
  }
  else if(errors.length === 0){
    /*no hay errores pero no se ha clickeado tampoco */
    return `bg-gradient-to-tr from-cyan-800 to-gray-300`;
  }
  else if(errors.length > 0){
    return `bg-gradient-to-tr from-red-700 to-blue-600`;
  }
  else return `bg-black`;
};

const Login = () => {
    const [errors, setErrors] = useState([]);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const [login] = useMutation(LOGIN, {client: userClient});
    const [showPassword, setShowPassword] = useState(false);

    
    const [isSignUpClicked,setIsSignUpClicked] = useState(false);
    const [isLoginClicked,setIsLoginClicked] = useState(false);

    //const [error, setError] = useState('');
    const [hasError, setHasError] = useState(false);
    const [hasRespOK, setHasRespOK] = useState(false);
    const [isLoading,setIsLoading] = useState(false);

  

  const handleLoginClick = async (evento) => {
    

    evento.preventDefault();
    setIsLoginClicked(true);
    setTimeout(() => {
      setIsLoginClicked(false);
    }, 300);

    let newErrors = [];

    if (user === '') {
      newErrors.push('Falta su nombre de usuario en la casilla "User Name".');
    }
    if (password === '') {
      newErrors.push('Falta contrasena en la casilla "Password".');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      activarErrores(setHasError, setErrors);
      return;
    }

    try {
      const request = await login({ variables: { username: user, password } });
      console.log(request);
      if (request.errors || !request.data) {
        newErrors.push('Login failed, credenciales incorrectas');
        console.log("error: credencial invalida");
        activarErrores(setHasError, setErrors);
        
      } else {
        setErrors([]);
        setHasRespOK(true);
        
        localStorage.setItem('token', request.data.login.token);
        localStorage.setItem('user', JSON.stringify(request.data.login.user));

        //si llega hasta aca, no hay errores
        setTimeout(() => {
          window.location.href = '/';
        }, 350);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors(['An error occurred']);
      activarErrores(setHasError, setErrors);
    }
  

  };
    

    const handleSignUpClick = (evento) => {
        window.scrollTo(0, 0);
        setIsSignUpClicked(true);
        setTimeout(() => {
            setIsSignUpClicked(false);
        }, 600);
        console.log('han clickeado sign up, se debe redirigir a la pagina de signup para crear una cuenta nueva');
        
    };

    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);//este formato es mas apropiado para async
    };

    return (
      <div className='flex h-screen -translate-y-3'>
        <div className='flex-1 flex justify-center rounded-md border-slate-200 border-2'>
          <div className='bg-white pt-5 rounded-xl'>
            <h1 className='font-montserrat text-6xl bg-gradient-to-tr from-cyan-300 to-cyan-800 rounded-sm bg-clip-text text-transparent font-extrabold'>
              Bienvenido
            </h1>
            <p className='font-montserrat text-2xl text-gray-400 flex items-center justify-center'>
            a C.L.S.
            </p>
          
            <form className='h-screen ml-5 mt-16' >
                      <div className='usuario'>
                              <label htmlFor='user' className='text-black text-2xl font-semibold'>Nombre de usuario</label>
                              <br></br>
                              <input 
                                  placeholder='Alias aquí...'
                                  type='text'
                                  id='usuario'
                                  value={user}
                                  onChange={(evento) =>setUser(evento.target.value)}
                                  maxLength={16}
                                  style={{ width:'300px'}}
                                  className={`w-full text-2xl rounded-md mt-3 py-2 hover:bg-gray-200`}/>
                      </div>
                      <br></br>
                      <div className='password'>
                          <label htmlFor='password' className='text-black text-2xl font-semibold'>Contraseña</label>
                          <br></br>
                          <input
                              placeholder="Clave aquí..."
                              type={showPassword? 'text' : 'password'}
                              id="password"
                              value={password}
                              onChange={(evento) =>setPassword(evento.target.value)}
                              style={{ width:'300px'}}
                              className={`w-full text-2xl rounded-md mt-7 py-2 hover:bg-gray-200`}
                              maxLength={16}
                          />
                          <button
                              onClick={toggleVisibility}
                              type="button"
                              className="text-2xl -translate-x-9 translate-y-1 focus:outline-none"
                          >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </button>
                      </div>
                      <div className='flex space mt-16 -translate-x-8'>

                      {/*boton de log-in*/}
                      <button
                                  type='submit'
                                  className={`text-white py-3 px-6 text-3xl rounded-3xl mt-4 ml-6 mb-4 transform hover:scale-105 active:scale-95  bg-gray-900 hover:bg-gray-950 ${isLoginClicked ? 'button-clicked' : ''}`}
                                  onClick={handleLoginClick}
                                  >
                                      Entrar
                                  </button>

                        {/*boton de sign-up*/}
                        <Link
                                  to={'/Signup'} onClick={handleSignUpClick}
                                  className="flex items-center justify-center text-white py-3 px-6 text-3xl rounded-3xl mt-4 ml-6 mb-4 
                          transform transition-all duration-300 
                          bg-gray-900 hover:bg-gray-950
                          active:scale-95 w-1/2.2 hover:scale-105"
                                  >
                                      Unirse
                                    

                                  </Link>

                      </div>
            </form>
          </div>
        
        </div>

        <div className='hidden relative lg:flex h-full items-center justify-center flex-1'>
        <div className={`w-60 h-60 rounded-full transition duration-100 ease-in-out ${isLoading? 'animate-pulse-spin': 'animate-spin'} ${getGradientClass(errors,hasRespOK)}`}> </div>
        <div className='w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg'></div>


        </div>
      </div>
    );
}

export default Login;

function activarErrores(setHasError, setErrors) {
  setHasError(true);
  setTimeout(() => {
    setErrors([]);
  }, 750);
}
