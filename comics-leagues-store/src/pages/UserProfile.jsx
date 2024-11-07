import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para la navegación
import {Button} from "@nextui-org/react";
import Sidebar from "../components/shared/Sidebar"

//Cerrar sesion
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Devuelve true si hay un token
};

const UserProfile = () => {
  const navigate = useNavigate(); // Hook de react-router-dom para redirigir

  const handleLogout = () => {
    logout(); // Cierra la sesión
    navigate('/'); // Redirige a la página de inicio
  };

  /*
  return (
    <Button color="primary" variant="shadow" onClick={handleLogout}>Cerrar Sesion</Button>
    
  );
  */
};

export default UserProfile;
