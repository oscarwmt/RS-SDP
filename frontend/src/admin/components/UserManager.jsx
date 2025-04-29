import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManager = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [usuarioEditado, setUsuarioEditado] = useState(null); // Estado para el usuario en edición
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${base}/api/usuarios`);
        setUsuarios(response.data);
      } catch (error) {
        console.error(
          "Error al cargar usuarios:",
          error.response?.data || error.message
        );
        setError(
          error.response?.data?.error ||
            "No se pudieron cargar los usuarios. Intenta nuevamente."
        );
      }
    };

    fetchUsuarios();
  }, []);

  const handleCrearUsuario = async () => {
    try {
      const base = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${base}/api/usuarios`, nuevoUsuario);
      setUsuarios([...usuarios, response.data]);
      setNuevoUsuario({ nombre: "", email: "", password: "" });
    } catch (error) {
      console.error("Error al crear usuario:", error.response || error);
      setError(
        error.response?.data?.error ||
          "No se pudo crear el usuario. Verifica los datos e intenta nuevamente."
      );
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      const base = import.meta.env.VITE_BASE_URL;
      await axios.delete(`${base}/api/usuarios/${id}`);
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error.response || error);
      setError(
        error.response?.data?.error ||
          "No se pudo eliminar el usuario. Intenta nuevamente."
      );
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditado(usuario);
  };

  const handleGuardarEdicion = async () => {
    try {
      const base = import.meta.env.VITE_BASE_URL;
      const response = await axios.put(
        `${base}/api/usuarios/${usuarioEditado.id}`,
        usuarioEditado
      );
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.id === response.data.id ? response.data : usuario
        )
      );
      setUsuarioEditado(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error.response || error);
      setError(
        error.response?.data?.error ||
          "No se pudo actualizar el usuario. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Administrador de Usuarios</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {usuarioEditado ? "Editar Usuario" : "Crear Usuario"}
        </h2>
        <input
          type="text"
          placeholder="Nombre"
          value={usuarioEditado ? usuarioEditado.nombre : nuevoUsuario.nombre}
          onChange={(e) =>
            usuarioEditado
              ? setUsuarioEditado({ ...usuarioEditado, nombre: e.target.value })
              : setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={usuarioEditado ? usuarioEditado.email : nuevoUsuario.email}
          onChange={(e) =>
            usuarioEditado
              ? setUsuarioEditado({ ...usuarioEditado, email: e.target.value })
              : setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={
            usuarioEditado
              ? usuarioEditado.password || ""
              : nuevoUsuario.password
          }
          onChange={(e) =>
            usuarioEditado
              ? setUsuarioEditado({
                  ...usuarioEditado,
                  password: e.target.value,
                })
              : setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        {usuarioEditado ? (
          <button
            onClick={handleGuardarEdicion}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={handleCrearUsuario}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        )}
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t">
              <td className="p-2">{usuario.id}</td>
              <td className="p-2">{usuario.nombre}</td>
              <td className="p-2">{usuario.email}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEditarUsuario(usuario)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminarUsuario(usuario.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
