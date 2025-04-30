import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/NavBar"; // Importar Navbar
import Footer from "../components/Footer"; // Importar Footer
import { formatNumber } from "../utils/formatNumber";

const PropertyDetails = () => {
  const { id } = useParams(); // ID de la propiedad
  const [property, setProperty] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  // Estado para los catálogos
  const [catalogos, setCatalogos] = useState({
    ciudades: [],
    estados: [],
    tipos: [],
    monedas: [],
  });

  // Cargar los datos de la propiedad, imágenes y catálogos
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL;

        // Cargar datos de la propiedad
        const propertyResponse = await fetch(`${base}/api/propiedades/${id}`);
        const propertyData = await propertyResponse.json();
        setProperty(propertyData);

        // Cargar imágenes asociadas a la propiedad
        const imagenesResponse = await fetch(
          `${base}/api/imagenes?propiedad_id=${id}`
        );
        const imagenesData = await imagenesResponse.json();

        // Construir URLs completas si es necesario
        const imagenesConUrlCompleta = imagenesData.map((image) => ({
          ...image,
          url: image.url.startsWith("http") ? image.url : `${base}${image.url}`,
        }));

        setImagenes(imagenesConUrlCompleta);

        // Establecer la primera imagen como seleccionada por defecto
        if (imagenesConUrlCompleta.length > 0) {
          setImagenSeleccionada(imagenesConUrlCompleta[0].url);
        }

        // Cargar los catálogos
        const catalogosResponse = await fetch(`${base}/api/catalogos`);
        const catalogosData = await catalogosResponse.json();
        setCatalogos(catalogosData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchPropertyData();
  }, [id]);

  // Función para obtener el nombre de la ciudad basado en el ID
  const getCiudadNombre = (ciudadId) => {
    const ciudad = catalogos.ciudades.find((c) => c.id === ciudadId);
    return ciudad ? ciudad.nombre : "Ciudad no especificada";
  };

  // Función para obtener el nombre del estado basado en el ID
  const getEstadoNombre = (estadoId) => {
    const estado = catalogos.estados.find((e) => e.id === estadoId);
    return estado ? estado.nombre : "Estado no especificado";
  };

  // Función para obtener el nombre del tipo basado en el ID
  const getTipoNombre = (tipoId) => {
    const tipo = catalogos.tipos.find((t) => t.id === tipoId);
    return tipo ? tipo.nombre : "Tipo no especificado";
  };

  // Función para obtener el símbolo de moneda basado en el ID
  const getMonedaSimbolo = (monedaId) => {
    const moneda = catalogos.monedas.find((m) => m.id === monedaId);
    return moneda ? moneda.simbolo : "$"; // Valor por defecto si no se encuentra
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Indicador de Ubicación (Breadcrumb) */}
      <div className="container mx-auto px-4 pt-20">
        {" "}
        {/* Padding top para evitar solapamiento */}
        <div className="text-sm text-gray-600 flex items-center space-x-2">
          {" "}
          {/* Texto más pequeño */}
          <Link to="/" className="hover:text-blue-600 hover:underline">
            Inicio
          </Link>
          <span>/</span>
          <Link
            to="/resultados"
            className="hover:text-blue-600 hover:underline"
          >
            Propiedades
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">
            {property?.titulo}
          </span>{" "}
          {/* Título en negrita */}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Detalles de la Propiedad */}
        <section className="mb-8">
          {/* Imagen Principal y Miniaturas */}
          <div className="mb-8">
            <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-md">
              <img
                src={imagenSeleccionada || "/default-image.jpg"}
                alt={property?.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex mt-4 space-x-4 overflow-x-auto">
              {imagenes.map((image, index) => (
                <div
                  key={index}
                  className="w-24 h-24 cursor-pointer"
                  onClick={() => setImagenSeleccionada(image.url)}
                >
                  <img
                    src={image.url}
                    alt={`Miniatura ${index}`}
                    className={`w-full h-full object-cover rounded-lg ${
                      image.url === imagenSeleccionada
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Información de la Propiedad */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {property?.titulo}
            </h2>
            <p className="text-xl font-semibold text-blue-600 mb-4">
              {getMonedaSimbolo(property?.moneda_id)} {formatNumber(property?.precio)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-700">
                  <strong>Habitaciones:</strong> {property?.habitaciones}
                </p>
                <p className="text-gray-700">
                  <strong>Baños:</strong> {property?.banos}
                </p>
                <p className="text-gray-700">
                  <strong>Estacionamientos:</strong>{" "}
                  {property?.estacionamientos}
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Construido (m²):</strong> {property?.construido_m2}
                </p>
                <p className="text-gray-700">
                  <strong>Terreno (m²):</strong> {property?.terreno_m2}
                </p>
                <p className="text-gray-700">
                  <strong>Ciudad:</strong>{" "}
                  {getCiudadNombre(property?.ciudad_id)}
                </p>
                <p className="text-gray-700">
                  <strong>Estado:</strong>{" "}
                  {getEstadoNombre(property?.estado_id)}
                </p>
                <p className="text-gray-700">
                  <strong>Tipo:</strong> {getTipoNombre(property?.tipo_id)}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              <strong>Descripción:</strong> <br></br>
              {property?.descripcion}
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PropertyDetails;
