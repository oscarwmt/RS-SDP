import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Verificar si hay un token en localStorage
  console.log("Token en ProtectedRoute:", token);

  if (!token) {
    console.log("Token no encontrado. Redirigiendo al login...");
    return <Navigate to="/login" replace />; // Redirigir a /login si no hay token
  }

  console.log("Token encontrado. Acceso permitido.");
  return children; // Renderizar el contenido protegido si hay token
};

export default ProtectedRoute;
