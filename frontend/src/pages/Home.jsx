import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import PropertySearch from "../components/PropertySearch";
import axios from "axios";
import Slider from "react-slick"; // Biblioteca para el carrusel
import "slick-carousel/slick/slick.css"; // Estilos del carrusel
import "slick-carousel/slick/slick-theme.css"; // Tema del carrusel
import { Link } from "react-router-dom"; // Importar Link

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [catalogos, setCatalogos] = useState({
    ciudades: [],
    estados: [],
    tipos: [],
    monedas: [], // Agregamos el catálogo de monedas
  });

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${base}/api/propiedades`);
        console.log("Datos recibidos del backend:", response.data);

        const properties = response.data;

        // Filtrar propiedades destacadas
        const destacadas = properties.filter((prop) => prop.destacada);

        // Completar con otras propiedades si no hay suficientes destacadas
        const finalProperties =
          destacadas.length >= 4
            ? destacadas.slice(0, 4)
            : [
                ...destacadas,
                ...properties
                  .filter((prop) => !prop.destacada)
                  .slice(0, 4 - destacadas.length),
              ];

        setFeaturedProperties(finalProperties);
      } catch (error) {
        console.error("Error al cargar propiedades destacadas:", error);
      }
    };

    const fetchCatalogos = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${base}/api/catalogos`);
        setCatalogos(response.data);
      } catch (error) {
        console.error("Error al cargar los catálogos:", error);
      }
    };

    fetchFeaturedProperties();
    fetchCatalogos();
  }, []);

  // Funciones para obtener nombres de catálogos por ID
  const getCiudadNombre = (ciudadId) => {
    const ciudad = catalogos.ciudades.find((c) => c.id === ciudadId);
    return ciudad ? ciudad.nombre : "Ciudad no especificada";
  };

  const getEstadoNombre = (estadoId) => {
    const estado = catalogos.estados.find((e) => e.id === estadoId);
    return estado ? estado.nombre : "Estado no especificado";
  };

  const getMonedaSimbolo = (monedaId) => {
    const moneda = catalogos.monedas.find((m) => m.id === monedaId);
    return moneda ? moneda.simbolo : "$"; // Valor por defecto si no se encuentra
  };

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Carrusel de Imágenes Destacadas */}
        <section className="mb-10 mt-10">
          <Slider {...settings}>
            {featuredProperties.map((property) => (
              <div key={property.id} className="relative">
                <img
                  src={property.imagen_destacada_url || "/default-image.jpg"}
                  alt={property.titulo}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-lg font-semibold">{property.titulo}</h3>
                  <p className="text-sm">
                    {getEstadoNombre(property.estado_id)},{" "}
                    {getCiudadNombre(property.ciudad_id)}
                  </p>
                  <p className="text-blue-400 font-bold">
                    {getMonedaSimbolo(property.moneda_id)} {property.precio}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Búsqueda de Propiedades */}
        <section className="bg-gray-100 shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-center mb-4">
            Buscar Propiedades
          </h2>
          <PropertySearch />
        </section>

        {/* Lista de Propiedades Destacadas */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Más Propiedades Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/propiedades/${property.id}`}
                  className="border rounded shadow hover:shadow-lg transition block"
                >
                  <div className="w-full h-48 overflow-hidden">
                    {property.imagen_destacada_url && (
                      <img
                        src={property.imagen_destacada_url}
                        alt={property.titulo}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{property.titulo}</h3>
                    <p className="text-sm text-gray-600">
                      {getEstadoNombre(property.estado_id)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getCiudadNombre(property.ciudad_id)}
                    </p>
                    <p className="text-blue-600 font-bold">
                      {getMonedaSimbolo(property.moneda_id)} {property.precio}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No hay propiedades disponibles.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
