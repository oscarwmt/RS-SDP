// src/admin/CreateProperty.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Verificar si hay un token en localStorage

  if (!token) {
    return <Navigate to="/admin/login" />; // Redirigir a /admin/login si no hay token
  }

  return children;
};

export default PrivateRoute;
