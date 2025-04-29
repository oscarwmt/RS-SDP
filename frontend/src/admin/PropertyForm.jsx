import React, { useEffect, useState } from "react";
import axios from "axios";

const PropertyForm = () => {
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
    piscina: "no",
    quincho: "no",
    mascotas: "no",
    destacada: false,
    imagenDestacada: "",
  });

  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [monedas, setMonedas] = useState([]);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [tiposRes, estadosRes, ciudadesRes, monedasRes] =
          await Promise.all([
            axios.get("/api/catalogos/tipos"),
            axios.get("/api/catalogos/estados"),
            axios.get("/api/catalogos/ciudades"),
            axios.get("/api/catalogos/monedas"),
          ]);
        setTipos(tiposRes.data);
        setEstados(estadosRes.data);
        setCiudades(ciudadesRes.data);
        setMonedas(monedasRes.data);
      } catch (error) {
        console.error("Error cargando catálogos:", error);
      }
    };

    fetchCatalogos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImagenes(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") data.append(key, value);
      });
      imagenes.forEach((img) => {
        data.append("imagenes", img);
      });

      await axios.post("/api/propiedades", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje("Propiedad creada con éxito.");
      setFormData({
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
        piscina: "no",
        quincho: "no",
        mascotas: "no",
        destacada: false,
        imagenDestacada: "",
      });
      setImagenes([]);
    } catch (error) {
      console.error("Error al crear propiedad:", error);
      setMensaje("Error al crear la propiedad.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Propiedad</h2>
      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleInputChange}
          className="col-span-2"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleInputChange}
          className="col-span-2"
          required
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleInputChange}
        />
        <input
          name="precio"
          placeholder="Precio"
          type="number"
          value={formData.precio}
          onChange={handleInputChange}
        />
        <select
          name="moneda_id"
          value={formData.moneda_id}
          onChange={handleInputChange}
        >
          <option value="">Moneda</option>
          {monedas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
        <select
          name="ciudad_id"
          value={formData.ciudad_id}
          onChange={handleInputChange}
        >
          <option value="">Ciudad</option>
          {ciudades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          name="estado_id"
          value={formData.estado_id}
          onChange={handleInputChange}
        >
          <option value="">Estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <select
          name="tipo_id"
          value={formData.tipo_id}
          onChange={handleInputChange}
        >
          <option value="">Tipo</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
        <input
          name="habitaciones"
          type="number"
          placeholder="Habitaciones"
          value={formData.habitaciones}
          onChange={handleInputChange}
        />
        <input
          name="banos"
          type="number"
          placeholder="Baños"
          value={formData.banos}
          onChange={handleInputChange}
        />
        <input
          name="estacionamientos"
          type="number"
          placeholder="Estacionamientos"
          value={formData.estacionamientos}
          onChange={handleInputChange}
        />
        <input
          name="construido_m2"
          type="number"
          placeholder="Construido (m²)"
          value={formData.construido_m2}
          onChange={handleInputChange}
        />
        <input
          name="terreno_m2"
          type="number"
          placeholder="Terreno (m²)"
          value={formData.terreno_m2}
          onChange={handleInputChange}
        />
        <select
          name="piscina"
          value={formData.piscina}
          onChange={handleInputChange}
        >
          <option value="no">Piscina</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
        <select
          name="quincho"
          value={formData.quincho}
          onChange={handleInputChange}
        >
          <option value="no">Quincho</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
        <select
          name="mascotas"
          value={formData.mascotas}
          onChange={handleInputChange}
        >
          <option value="no">Mascotas</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
        <label className="col-span-2">
          <input
            type="checkbox"
            name="destacada"
            checked={formData.destacada}
            onChange={handleInputChange}
          />
          <span className="ml-2">Destacada</span>
        </label>
        <input
          type="file"
          name="imagenes"
          multiple
          accept="image/*"
          onChange={handleImagenChange}
          className="col-span-2"
        />
        <input
          type="text"
          name="imagenDestacada"
          value={formData.imagenDestacada}
          onChange={handleInputChange}
          placeholder="Nombre imagen destacada (opcional)"
          className="col-span-2"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
