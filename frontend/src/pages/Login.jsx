// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Obtener la URL base desde las variables de entorno
      const base = import.meta.env.VITE_BASE_URL;
      if (!base) {
        throw new Error(
          "La URL base no está configurada en las variables de entorno."
        );
      }

      // Enviar credenciales al backend
      const response = await axios.post(`${base}/api/auth/login`, {
        email,
        password,
      });

      console.log("Respuesta completa del backend:", response);
      console.log("Datos del backend:", response.data);

      // Validar que la respuesta contenga token y usuario
      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;

        // Guardar el token y el usuario en localStorage
        localStorage.setItem("token", token); // Almacenar el token
        localStorage.setItem("user", JSON.stringify(user)); // Almacenar el usuario

        console.log("Usuario autenticado:", user);
        alert(
          `Inicio de sesión exitoso. Bienvenido, ${user.nombre || "Usuario"}!`
        );

        // Redirigir al área de administración
        console.log("Redirigiendo al área de administración...");
        navigate("/admin");
      } else {
        throw new Error("Datos de inicio de sesión incompletos.");
      }
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error.response?.data || error.message
      );

      // Mostrar el mensaje de error del backend si está disponible
      setError(
        error.response?.data?.error ||
          "Hubo un problema al iniciar sesión. Inténtalo más tarde."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h1 className="mb-4 text-2xl font-bold text-center">Iniciar Sesión</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
