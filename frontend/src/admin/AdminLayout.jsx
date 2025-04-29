// frontend/src/admin/AdminLayout.jsx

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Importar useNavigate
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r">
      <nav className="flex flex-col p-4 space-y-4">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700"
            }`
          }
        >
          Inicio
        </NavLink>
        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700"
            }`
          }
        >
          Usuarios
        </NavLink>
        <NavLink
          to="/admin/propiedades"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700"
            }`
          }
        >
          Propiedades
        </NavLink>
      </nav>
    </div>
  );
};

const AdminLayout = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Asegurarse de eliminar el token
    localStorage.removeItem("user"); // Eliminar datos del usuario
    navigate("/login"); // Redirigir al login
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Obtener el usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // Cambiado a "token" para consistencia

    if (!token || !storedUser) {
      console.log("Token o usuario no encontrado. Redirigiendo al login...");
      navigate("/login"); // Redirigir al login si no hay token o usuario
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.nombre) {
          console.log("Usuario autenticado:", parsedUser);
          setUser(parsedUser);
        } else {
          console.warn("El usuario no tiene un nombre válido.");
          handleLogout(); // Cerrar sesión si el usuario no es válido
        }
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
        handleLogout(); // Cerrar sesión si hay un error
      }
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div>
            <span className="text-gray-600">
              {currentTime.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Usuario: {user ? user.nombre : "Cargando..."}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
