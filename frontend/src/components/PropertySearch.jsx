import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PropertySearch = () => {
  const [catalogos, setCatalogos] = useState({
    tipos: [],
    ciudades: [],
  });
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const navigate = useNavigate();

  // Cargar los catálogos al montar el componente
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/catalogos`
        );
        const data = await response.json();
        setCatalogos(data); // Guardar los catálogos en el estado
      } catch (error) {
        console.error("Error al cargar los catálogos:", error);
      }
    };
    fetchCatalogos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    // Construir la URL con los parámetros de búsqueda
    const queryParams = new URLSearchParams({
      tipo_id: tipoSeleccionado || undefined,
      ciudad_id: ciudadSeleccionada || undefined,
    }).toString();

    navigate(`/resultados?${queryParams}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4"
    >
      {/* Selector de Tipo */}
      <div className="relative w-full md:w-auto">
        <select
          value={tipoSeleccionado}
          onChange={(e) => setTipoSeleccionado(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los tipos</option>
          {catalogos.tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de Ciudad */}
      <div className="relative w-full md:w-auto">
        <select
          value={ciudadSeleccionada}
          onChange={(e) => setCiudadSeleccionada(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las ciudades</option>
          {catalogos.ciudades.map((ciudad) => (
            <option key={ciudad.id} value={ciudad.id}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de Búsqueda */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
      >
        Buscar
      </button>
    </form>
  );
};

export default PropertySearch;
