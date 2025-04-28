import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Importar Link
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const SearchResults = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [catalogos, setCatalogos] = useState({
    tipos: [],
    ciudades: [],
    monedas: [], // Agregamos el catálogo de monedas
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  // Estado para el formulario de búsqueda
  const [tipoSeleccionado, setTipoSeleccionado] = useState(
    queryParams.get("tipo_id") || ""
  );
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(
    queryParams.get("ciudad_id") || ""
  );

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL || "http://localhost:5001";
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${base}/api/propiedades`, {
          headers,
        });

        let data = response.data;

        // Filtrar las propiedades según los parámetros de búsqueda
        const tipo_id = queryParams.get("tipo_id");
        const ciudad_id = queryParams.get("ciudad_id");

        if (tipo_id && /^\d+$/.test(tipo_id)) {
          data = data.filter(
            (propiedad) => propiedad.tipo_id === parseInt(tipo_id, 10)
          );
        }

        if (ciudad_id && /^\d+$/.test(ciudad_id)) {
          data = data.filter(
            (propiedad) => propiedad.ciudad_id === parseInt(ciudad_id, 10)
          );
        }

        setPropiedades(data); // Actualizar el estado con las propiedades filtradas
      } catch (error) {
        console.error("Error al cargar propiedades:", error);
        setPropiedades([]);
      }
    };

    const fetchCatalogos = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL || "http://localhost:5001";
        const response = await axios.get(`${base}/api/catalogos`);
        setCatalogos(response.data);
      } catch (error) {
        console.error("Error al cargar los catálogos:", error);
      }
    };

    fetchProperties();
    fetchCatalogos();
  }, [location.search]);

  // Función para obtener el nombre de un tipo por su ID
  const getTipoNombre = (tipoId) => {
    const tipo = catalogos.tipos.find((t) => t.id === tipoId);
    return tipo ? tipo.nombre : "Sin tipo";
  };

  // Función para obtener el nombre de una ciudad por su ID
  const getCiudadNombre = (ciudadId) => {
    const ciudad = catalogos.ciudades.find((c) => c.id === ciudadId);
    return ciudad ? ciudad.nombre : "Sin ciudad";
  };

  // Función para obtener el símbolo de moneda por su ID
  const getMonedaSimbolo = (monedaId) => {
    const moneda = catalogos.monedas.find((m) => m.id === monedaId);
    return moneda ? moneda.simbolo : "$"; // Valor por defecto si no se encuentra
  };

  // Manejar el envío del formulario de búsqueda
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
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-10">
        {/* Formulario de Búsqueda */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo:</label>
              <select
                value={tipoSeleccionado}
                onChange={(e) => setTipoSeleccionado(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Todos los tipos</option>
                {catalogos.tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ciudad:</label>
              <select
                value={ciudadSeleccionada}
                onChange={(e) => setCiudadSeleccionada(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Todas las ciudades</option>
                {catalogos.ciudades.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
              >
                Buscar
              </button>
            </div>
          </div>
        </form>

        {/* Resultados de la Búsqueda */}
        <h2 className="text-2xl font-semibold mb-4">
          Resultados de la Búsqueda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(propiedades) && propiedades.length > 0 ? (
            propiedades.map((prop) => (
              <Link
                key={prop.id}
                to={`/propiedades/${prop.id}`} // Enlace a PropertyDetails
                className="border rounded shadow p-4 block hover:shadow-lg transition-shadow"
              >
                <img
                  src={prop.imagen_destacada_url || "/default-image.jpg"}
                  alt={prop.titulo}
                  className="w-full h-48 object-cover mb-4 cursor-pointer"
                />
                <h3 className="text-lg font-semibold">{prop.titulo}</h3>
                <p className="text-sm text-gray-600">
                  {getTipoNombre(prop.tipo_id)}
                </p>
                <p className="text-sm text-gray-600">
                  {getCiudadNombre(prop.ciudad_id)}
                </p>
                <p className="text-blue-600 font-bold">
                  {getMonedaSimbolo(prop.moneda_id)} {prop.precio}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No se encontraron propiedades.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SearchResults;
