import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "./components/ImageUpload";

const CreateProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Verificar si el token existe al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No se encontró un token. Redirigiendo al inicio de sesión.");
      navigate("/login"); // Redirigir si no hay token
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    direccion: "",
    precio: "",
    moneda_id: "",
    ciudad_id: "",
    estado_id: "",
    tipo_id: "",
    habitaciones: "",
    banos: "",
    estacionamientos: "",
    construido_m2: "",
    terreno_m2: "",
    piscina: false,
    quincho: false,
    mascotas: false,
    destacada: false,
    imagenDestacada: "",
  });

  const [images, setImages] = useState([]);
  const [imagenDestacada, setImagenDestacada] = useState("");
  const [monedas, setMonedas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const res = await axios.get(`${baseURL}/api/catalogos`, { headers });

        const { monedas, ciudades, estados, tipos } = res.data;

        setMonedas(Array.isArray(monedas) ? monedas : []);
        setCiudades(Array.isArray(ciudades) ? ciudades : []);
        setEstados(Array.isArray(estados) ? estados : []);
        setTipos(Array.isArray(tipos) ? tipos : []);
      } catch (error) {
        console.error(
          "Error al cargar catálogos:",
          error.response || error.message
        );
        alert(
          "Hubo un error al cargar los catálogos. Por favor, verifica la API."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogos();
  }, [baseURL]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Convertir "si" o "no" a booleanos para campos checkbox
    const fieldValue =
      type === "checkbox"
        ? checked
        : ["destacada", "piscina", "quincho", "mascotas"].includes(name)
        ? value === "si"
        : value;

    setFormData({
      ...formData,
      [name]: fieldValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("direccion", formData.direccion);
      formDataToSend.append("precio", formData.precio);
      formDataToSend.append("moneda_id", formData.moneda_id);
      formDataToSend.append("ciudad_id", formData.ciudad_id);
      formDataToSend.append("estado_id", formData.estado_id);
      formDataToSend.append("tipo_id", formData.tipo_id);
      formDataToSend.append("habitaciones", formData.habitaciones);
      formDataToSend.append("banos", formData.banos);
      formDataToSend.append("estacionamientos", formData.estacionamientos);
      formDataToSend.append("construido_m2", formData.construido_m2);
      formDataToSend.append("terreno_m2", formData.terreno_m2);
      formDataToSend.append("piscina", formData.piscina);
      formDataToSend.append("quincho", formData.quincho);
      formDataToSend.append("mascotas", formData.mascotas);
      formDataToSend.append("destacada", formData.destacada);
      formDataToSend.append("imagenDestacada", imagenDestacada);

      images.forEach((image) => {
        formDataToSend.append("imagenes", image);
      });

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      console.log("Datos enviados:", formDataToSend);
      console.log("Encabezados enviados:", headers);

      if (id) {
        await axios.put(`${baseURL}/api/propiedades/${id}`, formDataToSend, {
          headers,
        });
      } else {
        await axios.post(`${baseURL}/api/propiedades`, formDataToSend, {
          headers,
        });
      }
      navigate("/admin/propiedades");
    } catch (err) {
      console.error("Error al guardar la propiedad:", err);
      if (
        err.response &&
        err.response.data.error === "Token inválido o expirado."
      ) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        navigate("/login");
      } else {
        alert(
          "Hubo un error al guardar la propiedad. Por favor, verifica la API."
        );
      }
    }
  };

  const submitExample = async () => {
    const formData = new FormData();
    formData.append("titulo", "Casa 1");
    formData.append("descripcion", "Descripción de la propiedad");
    formData.append("direccion", "Dirección de la propiedad");
    formData.append("precio", 100000);
    formData.append("moneda_id", 1);
    formData.append("ciudad_id", 1);
    formData.append("estado_id", 1);
    formData.append("tipo_id", 1);
    formData.append("habitaciones", 3);
    formData.append("banos", 2);
    formData.append("estacionamientos", 1);
    formData.append("construido_m2", 120);
    formData.append("terreno_m2", 200);
    formData.append("piscina", "false");
    formData.append("quincho", "true");
    formData.append("mascotas", "true");
    formData.append("destacada", "false");

    // Agregar imágenes
    formData.append("imagenes", file1); // Archivo de imagen
    formData.append("imagenes", file2); // Otro archivo de imagen

    axios.post("/api/propiedades", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Editar Propiedad" : "Crear Propiedad"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección"
          className="border p-2 rounded"
          required
        />
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="border p-2 rounded col-span-2"
          rows={4}
          required
        ></textarea>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="border p-2 rounded"
          required
        />
        <select
          name="moneda_id"
          value={formData.moneda_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Seleccione Moneda</option>
          {monedas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
        <select
          name="ciudad_id"
          value={formData.ciudad_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Seleccione Ciudad</option>
          {ciudades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          name="estado_id"
          value={formData.estado_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Seleccione Estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <select
          name="tipo_id"
          value={formData.tipo_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Seleccione Tipo</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="habitaciones"
          value={formData.habitaciones}
          onChange={handleChange}
          placeholder="Habitaciones"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="banos"
          value={formData.banos}
          onChange={handleChange}
          placeholder="Baños"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="estacionamientos"
          value={formData.estacionamientos}
          onChange={handleChange}
          placeholder="Estacionamientos"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="construido_m2"
          value={formData.construido_m2}
          onChange={handleChange}
          placeholder="Construido (m²)"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="terreno_m2"
          value={formData.terreno_m2}
          onChange={handleChange}
          placeholder="Terreno (m²)"
          className="border p-2 rounded"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="piscina"
            checked={formData.piscina}
            onChange={handleChange}
          />{" "}
          Piscina
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="quincho"
            checked={formData.quincho}
            onChange={handleChange}
          />{" "}
          Quincho
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="mascotas"
            checked={formData.mascotas}
            onChange={handleChange}
          />{" "}
          Acepta Mascotas
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="destacada"
            checked={formData.destacada}
            onChange={handleChange}
          />{" "}
          Propiedad Destacada
        </div>

        <ImageUpload
          images={images}
          setImages={setImages}
          imagenDestacada={imagenDestacada}
          setImagenDestacada={setImagenDestacada}
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
