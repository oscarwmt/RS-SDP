import React, { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState(null); // Nueva variable para la contraseña generada
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const base = import.meta.env.VITE_BASE_URL; // URL base desde las variables de entorno
      const response = await axios.post(`${base}/api/users`, {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess("Usuario creado exitosamente.");
        setName("");
        setEmail("");
        setPassword("");
        setGeneratedPassword(null); // Limpiar la contraseña generada
      } else {
        throw new Error("Error inesperado al crear el usuario.");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error.response || error);
      setError(
        error.response?.data?.error ||
          "Hubo un problema al crear el usuario. Inténtalo más tarde."
      );
    }
  };

  const generatePassword = () => {
    const tempPassword = Math.random().toString(36).slice(-8); // Generar una contraseña aleatoria de 8 caracteres
    setPassword(tempPassword);
    setGeneratedPassword(tempPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h1 className="mb-4 text-2xl font-bold text-center">Crear Usuario</h1>
        {success && <p className="mb-4 text-green-500">{success}</p>}
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
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
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="button"
            onClick={generatePassword}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Generar Contraseña
          </button>
          {generatedPassword && (
            <p className="mt-2 text-sm text-gray-600">
              Contraseña generada: <strong>{generatedPassword}</strong>
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
