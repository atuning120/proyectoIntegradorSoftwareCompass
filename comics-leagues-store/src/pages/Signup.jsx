import React, { useState } from 'react';
import '../index.css';
import '../animations.css';
import Login from './Login';
import BackButton from '../components/BackButton';
import { useMutation, gql } from '@apollo/client';
import { userClient } from '../apolloClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const isAuthenticated = () => {
	const token = localStorage.getItem('token');
  if(token){
    return true;
  }
	return false;
};

const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out(no esta llegando al backend o no esta regresando)')), timeout)
    )
]);
};


const SIGNUP_MUTATION = gql`
mutation SignUp($input: NewUserInput!) {
  signUp(input: $input) {
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

const Signup = () => {
    const [errors, setErrors] = useState([]);
    const [errorState,setErrorState] = useState(new Array(7).fill(false));
    


    const [name,setName] = useState('');
    const [lastname,setLastname] = useState('');
    const [userAge, setUserAge] = useState('');
    const [email,setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [phone,setPhone] = useState('');
    const [isRoleInHovered,setIsRoleInHovered] = useState(false);

    
    const [hasError, setHasError] = useState(false);

    const [error, setError] = useState('');

    const [isTeacher, setIsTeacher] = useState(false);
    const [isSignUpHovered,setIsSignUpHovered] = useState(false);
    const [isSignUpClicked, setIsSignUpClicked] = useState(false);

    const [isAccountCreated, setIsAccountCreated] = useState(false);
  

    const [isNameOK,setIsNameOK] = useState(false);

    const [signupGQL] = useMutation(SIGNUP_MUTATION, {client:userClient});
    const [showPassword, setShowPassword] = useState(false);


    const handleRoleButtonClick = (e) => {
        setIsTeacher(!isTeacher);
    };

    


    const handleSignUpClick = async (evento) => {
        evento.preventDefault(); //evita que se reinicie la pagina
        setIsSignUpClicked(true);

        setTimeout(() => 
        {
            setIsSignUpClicked(false);
        }, 300);
            
        let newErrorState = new Array(7).fill(false);
        let newErrors =[];
        console.log("ha hecho click: intentando crear cuenta");

        //regex para validar email(brutal)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(name == ''){
            newErrors.push('Falta nombre en la casilla "Name".');
            newErrorState[0] = true;
        }
        if(lastname == ''){
            newErrors.push('Falta apellido en la casilla "Last Name".');
            newErrorState[1] = true;
        }
        if(userAge <= 1 || userAge > 120 || userAge === undefined){
            newErrors.push('Falta una edad valida en la casilla "Age".');
            newErrorState[2] = true;
        }
        if(email == ''){
            newErrors.push('Falta su correo en la casilla "Email".');
            newErrorState[3] = true;
        }
        if (!emailRegex.test(email)) {
            newErrors.push('Formato invalido de email detectado.');
            newErrorState[3] = true;
        }
        if(user == ''){
            newErrors.push('Falta su nombre de usuario en la casilla "User Name".');
            newErrorState[4] = true;
        }
        if(password == ''){
           newErrors.push('Falta contraseña en la casilla "Password".');
           newErrorState[5] = true;
        }
        if(password.length < 4){
            newErrors.push('Su contraseña es demasiado corta, debe usar al menos 4 characteres.');
            newErrorState[5] = true;
        }
        if(phone == ''){
            newErrors.push('Falta numero de telefono en la casilla "Phone".');
            newErrorState[6] = true;
        }
        
        if (newErrors.length > 0) {
            setErrors(newErrors);
            setHasError(true);
            setIsAccountCreated(false);
            setErrorState(newErrorState);
            return;
        } else {
            setErrorState(newErrorState);
            setHasError(false);
            try {
                console.log("Enviando solicitud al backend para almacenar esta cuenta nueva");

                const response = await signupGQL({
                    variables: {
                        input: {
                            nombre: name,
                            apellido: lastname,
                            edad: parseInt(userAge),
                            correo: email,
                            username: user,
                            password: password,
                            telefono: phone,
                            rol: isTeacher ? 'profesor' : 'alumno',
                        }
                    }});
                
                if(response.errors || !response.data){
                    newErrors.push('Error en la creacion de la cuenta.');
                    setErrors(newErrors);
                    setIsAccountCreated(false);
                    return;
                }
                console.log('Registro exitoso:', response.data.signUp);
                setErrors([]);
                setIsAccountCreated(true);
                console.log("token: ",response.data.signUp.token)
                localStorage.setItem('token', response.data.signUp.token);
                localStorage.setItem('user', JSON.stringify(response.data.signUp.user));
                
                // Redirigir a la página de inicio
                setTimeout(() => {
                    window.location.href = '/';
                  }, 350);
            } catch (error) {
                console.error('Error durante la creacion de la cuenta:', error);
                newErrors.push('Error durante la creacion de la cuenta.');
                setErrors(newErrors);
                setIsAccountCreated(false);
            }
        }
    };
    

    const toggleVisibility = () => {
        setShowPassword((prev) => !prev);//este formato es mas apropiado para async
      };

    return(
        <div className='flex h-screen -translate-y-3'>
            <div className='flex-1 w-1/2 flex justify-center rounded-md border-slate-200 border-2'>
                <div className='bg-white p-6 rounded-xl h-full'>
                    <h1 className='-translate-y-2 font-montserrat text-5xl bg-gradient-to-tr from-cyan-300 to-cyan-800 rounded-sm bg-clip-text text-transparent font-extrabold'>
                    Únete ahora
                    </h1>
                    <p className='font-montserrat text-2xl text-gray-400 flex items-center justify-center pr-40'>
                    <br></br>
                    </p>
            <form className='h-full -translate-y-3'>
                    <div className='name'>
                        <label htmlFor='name' className='text-black  text-2xl'>Nombre</label>
                        <input 
                            placeholder='Nombre aquí...'
                            type='text'
                            id='name'
                            value={name}
                            onChange={(evento) =>setName(evento.target.value)}
                            maxLength={16}
                            style={{ width:'300px',marginLeft:'48px'}}
                            className='w-full text-2xl rounded-md py-1 hover:bg-gray-200' />

                            {errorState[0] && <p className='-translate-y-14 translate-x-36 absolute text-red-500 text-sm mt-1'>{"Error, nombre no puede estar en blanco"}</p>} {/* Error Message */}
                    </div>
                    <div className='lastname'>
                        <label htmlFor='lastname' className='text-black  text-2xl'>Apellido</label>
                        <input 
                            placeholder='Apellido aquí...'
                            type='text'
                            id='lastname'
                            value={lastname}
                            onChange={(evento) =>setLastname(evento.target.value)}
                            maxLength={16}
                            style={{ width:'300px',marginLeft:'50px'}}
                            className='w-full text-2xl rounded-md mt-3 py-1 hover:bg-gray-200' />

                            {errorState[1] && <p className='-translate-y-14 translate-x-36 absolute text-red-500 text-sm mt-1'>{"Error, apellido no puede estar en blanco"}</p>} {/* Error Message */}
                    </div>

                    <div className='age'>
                        <label htmlFor='age' className='text-black text-2xl mr-1'>Edad</label>
                        <input
                            placeholder='Edad aquí...'
                            type='number'
                            id='age'
                            value={userAge}
                            onChange={(evento) =>setUserAge(evento.target.value)}
                            min={2}
                            max={120}
                            style={{ width:'300px',marginLeft:'80px'}}
                            
                            className='w-full text-2xl rounded-md mt-3 py-1 hover:bg-gray-200' />
                            
                            {errorState[2] && <p className='-translate-y-14 translate-x-36 absolute text-red-500 text-sm mt-1'>{"Error, edad fuera de rango"}</p>} {/* Error Message */}
                    </div>

                    <div className='email'>
                        <label htmlFor='user' className='text-black  text-2xl'>Correo</label>
                        <input 
                            placeholder='Correo aquí...'
                            type='email'
                            id='email'
                            value={email}
                            onChange={(evento) =>setEmail(evento.target.value)}
                            maxLength={20}
                            style={{ width:'300px',marginLeft:'66.5px'}}
                            className='w-full text-2xl rounded-md mt-3 py-1 hover:bg-gray-200' />
                            {errorState[3] && <p className='-translate-y-14 translate-x-36 absolute text-red-500 text-sm mt-1'>{"Error, correo invalido o inexistente"}</p>} {/* Error Message */}
                    </div>

                    <div className='usuario'>
                        <label htmlFor='user' className='text-black text-2xl'>Alias</label>
                        <input 
                            placeholder='Alias aquí...'
                            type='text'
                            id='usuario'
                            value={user}
                            onChange={(evento) =>setUser(evento.target.value)}
                            maxLength={16}
                            style={{ width:'300px',marginLeft:'90px'}}
                            className='w-full text-2xl rounded-md mt-3 py-1 hover:bg-gray-200' />
                            {errorState[4] && <p className='-translate-y-14 translate-x-36 absolute text-red-500 text-sm mt-1'>{"Error, usuario no puede estar en blanco"}</p>} {/* Error Message */}
                    </div>
                    
                    <div className='password'>
                        <label htmlFor='password' className='text-black text-2xl'>Clave</label>
                        <input
                            placeholder="Contraseña aquí..."
                            type={showPassword? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(evento) =>setPassword(evento.target.value)}
                            style={{ width:'300px',marginLeft:'80px'}}
                            className='w-full text-2xl rounded-md mt-3 py-1 hover:bg-gray-200'
                            maxLength={16} />
                            {errorState[5] && <p className='-translate-y-14 translate-x-36 absolute text-red-500 text-sm mt-1'>{"Error, contraseña no cumple los requisitos"}</p>} {/* Error Message */}

                            <button
                              onClick={toggleVisibility}
                              type="button"
                              className="text-2xl -translate-x-9 translate-y-1 focus:outline-none"
                          >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </button>
                    </div>

                    <div className='phone'>
                        <label htmlFor='phone' className='text-black text-2xl'>Celular</label>
                        <input 
                            placeholder='Numero de celular aquí...'
                            type='text'
                            id='phone'
                            value={phone}
                            onChange={(evento) =>setPhone(evento.target.value)}
                            maxLength={16}
                            style={{ width:'300px',marginLeft:'57px'}}
                            className='w-full text-2xl rounded-md mt-3 py-1 hover:bg-gray-200' />
                            {errorState[6] && <p className='-translate-y-14 translate-x-36 absolute text-red-500 text-sm mt-1'>{"Error, numero de celular inexistente"}</p>} {/* Error Message */}
                    </div>
                    
                    <div className='mt-1'>
                        <div className='relative'>
                            <p className='text-black text-2xl'>Escoge tu rol:</p>
                            <h3 className='text-black text-2xl mb-4 ml-52 absolute top-0'>{isTeacher ? 'Eres un profesor' : 'Eres un estudiante'}</h3>
                        </div>
                    <div className='ml-52'>
                        <input
                            type='radio'
                            id='student'
                            name='role'
                            value='student'
                            checked={!isTeacher}
                            onChange={handleRoleButtonClick}
                            className='w-7 h-7 mr-2'
                            style={{ accentColor: '#e5e4e2' }}
                        />
                        <label htmlFor='student' className='text-black text-2xl'>Estudiante</label>
                        <br></br>
                        <input
                            type='radio'
                            id='teacher'
                            name='role'
                            value='teacher'
                            checked={isTeacher}
                            onChange={handleRoleButtonClick}
                            className='w-7 h-7 mr-2'
                            style={{ accentColor: '#e5e4e2' }}
                        />
                        <label htmlFor='teacher' className='text-black text-2xl'>Profesor</label>
                    </div>

                    <br></br>
                    {/*boton de sign-up*/}
                        <button     
                        type='submit'
                        className={`text-white py-3 px-6 text-3xl rounded-3xl ml-6 mb-2 transform hover:scale-105 active:scale-95  bg-gray-900 hover:bg-gray-950 ${isSignUpClicked ? 'button-clicked' : ''}`}
                        onMouseEnter={() => setIsSignUpHovered(true)}
                        onMouseLeave={() => setIsSignUpHovered(false)}
                        onClick={handleSignUpClick}
                        
                    >
                    Unirse a C.L.S.
                    </button>
                </div>

                {/*boton de regreso a log-in*/}
                <div>
                    <BackButton to={'/login'} destination={'log-in'}/>
                </div>
                    

            </form>
                </div>

            </div>
            <div className='flex-1 flex justify-center items-center h-screen'>
                <div className='w-full h-full overflow-hidden rounded-md border-gray-400 border-8'>
                    <img
                        src='src\assets\ai_bar.webp'
                        alt='imagen placeholder'
                        className='w-full h-full object-cover' 
                    />
                </div>
            </div>
    
            
            

        </div>
    );



}

export default Signup;