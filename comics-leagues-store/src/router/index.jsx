import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import HomePages from "../pages/HomePage";
import CursosPage from "../pages/CursosPage"; "../pages/CursosPage.jsx";
import Login from '../pages/Login.jsx';
import SignUp from '../pages/Signup.jsx';
import Policies from "../pages/Policies.jsx";
import Privacy from "../pages/TermsOfUse.jsx";
import UserProfile from '../pages/UserProfile.jsx';
import Historial from '../components/Historial.jsx';
import Perfil from '../components/Perfil.jsx';
import SetPerfil from '../components/SetPerfil.jsx';

export const router= createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        children:[
            {
                index:true,
                element: <HomePages/>
            },
            {
                path:'cursos',
                element: <CursosPage/>
            },
            {
                path:'login',
                element: <Login />
            },
            {
                path:'signup',
                element: <SignUp />
            },
            {
                path:'policies',
                element: <Policies />
            },
            {
                path:'termsofuse',
                element: <Privacy />
            },
            {
                path:'userprofile',
                element: <UserProfile />
            },
            {
                path:'userprofile/perfil',
                element: <Perfil>Componente para mostrar los datos del usuario, en el proyecto esta en la carpeta de router</Perfil>
            },
            {
                path:'userprofile/setPerfil',
                element: <SetPerfil>Componente para modificar datos del usuario, en el proyecto esta en la carpeta de router</SetPerfil>
            },
            {
                path:'userprofile/Historial',
                element: <Historial>Componente para mostrar las compras del usuario, en el proyecto esta en la carpeta de router</Historial>
            },
            {
                path:'paySystem',
                element:<div>pagar epicamente anashei</div>
            },
            
        ]
    },
]);