// src/admin/PropertyList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const PropertyList = () => {
  const [propiedades, setPropiedades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const validarToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        navigate("/login");
      }
    };

    const fetchProperties = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL || "http://localhost:5001"; // Asegúrate de que la URL base sea correcta
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${base}/api/propiedades`, {
          headers,
        });

        if (Array.isArray(response.data)) {
          setPropiedades(response.data);
        } else {
          console.error(
            "La respuesta del backend no es un array:",
            response.data
          );
          setPropiedades([]);
        }
      } catch (error) {
        console.error("Error al cargar propiedades:", error);
        setPropiedades([]);
      }
    };

    validarToken();
    fetchProperties();
  }, [navigate]);

  const handleEliminar = async (id) => {
    try {
      const base = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No tienes permiso para realizar esta acción. Inicia sesión.");
        navigate("/login");
        return;
      }

      await axios.delete(`${base}/api/propiedades/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPropiedades((prevPropiedades) =>
        prevPropiedades.filter((prop) => prop.id !== id)
      );
      alert("Propiedad eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar propiedad:", error.response || error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert(
          "Token inválido o expirado. Por favor, inicia sesión nuevamente."
        );
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.error ||
            "No se pudo eliminar la propiedad. Intenta nuevamente."
        );
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/editar-propiedad/${id}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Propiedades existentes</h2>
        <Link
          to="/admin/create-property"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Crear Propiedad
        </Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Imagen</th>
            <th className="p-2">Título</th>
            <th className="p-2">Dirección</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Ciudad</th>
            <th className="p-2">Destacada</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(propiedades) &&
            propiedades.map((prop) => (
              <tr key={prop.id} className="border-t">
                <td className="p-2">{prop.id}</td>
                <td className="p-2">
                  {/* Mostrar la imagen destacada */}
                  {prop.imagen_destacada_url && (
                    <img
                      src={prop.imagen_destacada_url} // Usar directamente la URL completa
                      alt={prop.titulo}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2">{prop.titulo}</td>
                <td className="p-2">{prop.direccion}</td>
                <td className="p-2">
                  {prop.precio} {prop.moneda_nombre || ""}
                </td>
                <td className="p-2">{prop.ciudad_nombre || ""}</td>
                <td className="p-2">{prop.destacada ? "Sí" : "No"}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(prop.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(prop.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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

export default PropertyList;
