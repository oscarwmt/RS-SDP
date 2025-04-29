// src/admin/CreateProperty.jsx actualizado
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const CreateProperty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const propiedadInicial = location.state?.propiedad || null;
  const isEditingInicial = location.state?.isEditing || false;

  const [imagenesActuales, setImagenesActuales] = useState([]);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [imagenDestacada, setImagenDestacada] = useState(null);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);

  const [formData, setFormData] = useState({
    titulo: propiedadInicial?.titulo || "",
    descripcion: propiedadInicial?.descripcion || "",
    direccion: propiedadInicial?.direccion || "",
    precio: propiedadInicial?.precio || "",
    moneda_id: propiedadInicial?.moneda_id || "",
    ciudad_id: propiedadInicial?.ciudad_id || "",
    estado_id: propiedadInicial?.estado_id || "",
    tipo_id: propiedadInicial?.tipo_id || "",
    habitaciones: propiedadInicial?.habitaciones || 0,
    banos: propiedadInicial?.banos || 0,
    estacionamientos: propiedadInicial?.estacionamientos || 0,
    construido_m2: propiedadInicial?.construido_m2 || 0,
    terreno_m2: propiedadInicial?.terreno_m2 || 0,
    piscina: propiedadInicial?.piscina || "no",
    quincho: propiedadInicial?.quincho || "no",
    mascotas: propiedadInicial?.mascotas || "no",
    destacada:
      propiedadInicial?.imagen_destacada !== undefined
        ? propiedadInicial.imagen_destacada
        : "",
    imagenes:
      propiedadInicial?.imagenes?.map((img) => ({
        file: null,
        url: img.nombre,
      })) || [],
  });

  const [ciudades, setCiudades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadEditada, setPropiedadEditada] = useState(
    isEditingInicial ? propiedadInicial : null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const base = import.meta.env.VITE_BASE_URL;
        const [resCiudades, resEstados, resTipos, resMonedas, resProps] =
          await Promise.all([
            axios.get(`${base}/api/catalogos/ciudades`, { headers }),
            axios.get(`${base}/api/catalogos/estados`, { headers }),
            axios.get(`${base}/api/catalogos/tipos`, { headers }),
            axios.get(`${base}/api/catalogos/monedas`, { headers }),
            axios.get(`${base}/api/propiedades`, { headers }),
          ]);

        // Usar propiedadInicial en lugar de prop
        if (propiedadInicial) {
          setImagenesActuales(propiedadInicial.imagenes || []); // Asegurarse de que `imagenes` exista
          const destacada = propiedadInicial.imagenes?.find(
            (img) => img.destacada
          );
          setImagenDestacada(destacada ? destacada.id : null);
        }

        setCiudades(resCiudades.data);
        setEstados(resEstados.data);
        setTipos(resTipos.data);
        setMonedas(resMonedas.data);
        setPropiedades(resProps.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [propiedadInicial]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNuevasImagenes = (e) => {
    const files = Array.from(e.target.files);
    setImagenesNuevas((prev) => [...prev, ...files]);
  };

  const eliminarImagenActual = (id) => {
    setImagenesActuales((prev) => prev.filter((img) => img.id !== id));
    setImagenesAEliminar((prev) => [...prev, id]);
    if (imagenDestacada === id) setImagenDestacada(null);
  };

  const marcarComoDestacada = (id) => {
    setImagenDestacada(id);
  };

  const fileInputRef = useRef();

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));

      setFormData((prevState) => {
        const updatedImages = [...prevState.imagenes, ...newImages];
        return {
          ...prevState,
          imagenes: updatedImages,
        };
      });

      // Resetea el input después de seleccionar las imágenes
      fileInputRef.current.value = "";
    }
  };

  const handleDestacadaSelect = (id) => {
    setImagenDestacada(id);
  };

  const handleRemoveImage = (index) => {
    setFormData((prevState) => {
      const updatedImages = prevState.imagenes.filter((_, i) => i !== index);
      let destacada = prevState.destacada;

      if (destacada === index) {
        destacada = updatedImages[0] ? 0 : null;
      }

      return {
        ...prevState,
        imagenes: updatedImages,
        destacada,
      };
    });
  };

  const handleEditar = async (id) => {
    try {
      const base = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${base}/api/propiedades/${id}`, {
        headers,
      });
      const propiedad = response.data;

      const imagenes = propiedad.imagenes?.map((img) => ({
        file: null,
        url: img.nombre,
      }));

      setPropiedadEditada(propiedad);

      setFormData({
        titulo: propiedad.titulo || "",
        descripcion: propiedad.descripcion || "",
        direccion: propiedad.direccion || "",
        precio: propiedad.precio || "",
        moneda_id: propiedad.moneda_id || "",
        ciudad_id: propiedad.ciudad_id || "",
        estado_id: propiedad.estado_id || "",
        tipo_id: propiedad.tipo_id || "",
        habitaciones: propiedad.habitaciones || 0,
        banos: propiedad.banos || 0,
        estacionamientos: propiedad.estacionamientos || 0,
        construido_m2: propiedad.construido_m2 || 0,
        terreno_m2: propiedad.terreno_m2 || 0,
        piscina: propiedad.piscina || "no",
        quincho: propiedad.quincho || "no",
        mascotas: propiedad.mascotas || "no",
        destacada:
          propiedad.imagen_destacada !== undefined
            ? propiedad.imagen_destacada
            : 0,
        imagenes: imagenes || [],
      });
    } catch (error) {
      console.error("Error al cargar la propiedad:", error);
      alert("No se pudo cargar la propiedad para editar.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Agregar campos del formulario
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "imagenes") {
        data.append(key, value);
      }
    });

    // Agregar nuevas imágenes
    imagenesNuevas.forEach((imagen) => {
      data.append("imagenes", imagen);
    });

    // Agregar imágenes a eliminar (si hay)
    if (imagenesAEliminar.length > 0) {
      data.append("imagenes_a_eliminar", JSON.stringify(imagenesAEliminar));
    }

    // Determinar imagen destacada
    let destacadaId = imagenDestacada;

    if (!destacadaId) {
      if (imagenesNuevas.length > 0) {
        destacadaId = "nueva_" + imagenesNuevas[0].name; // Convención para distinguir en backend
      } else if (imagenesActuales.length > 0) {
        destacadaId = imagenesActuales[0].id;
      }
    }

    data.append("imagen_destacada", destacadaId);

    try {
      if (propertyId) {
        // Actualización
        await axios.put(
          `${import.meta.env.VITE_API_URL}/propiedades/${propertyId}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Propiedad actualizada correctamente");
      } else {
        // Creación
        await axios.post(`${import.meta.env.VITE_API_URL}/propiedades`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Propiedad creada correctamente");
      }

      // Limpiar formulario si es creación
      if (!propertyId) {
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
          piscina: false,
          quincho: false,
          mascotas: false,
          destacada: false,
          imagenes: [],
        });
        setImagenesActuales([]);
        setImagenesNuevas([]);
        setImagenesAEliminar([]);
        setImagenDestacada(null);
      }
    } catch (error) {
      console.error("Error al guardar la propiedad", error);
      toast.error("Ocurrió un error al guardar la propiedad");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">
          {propiedadEditada ? "Guardar Cambios" : "Crear Propiedad"}
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="w-full border p-2 rounded text-sm"
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Moneda</label>
            <select
              name="moneda_id"
              value={formData.moneda_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="">Seleccione moneda</option>
              {monedas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Habitaciones
            </label>
            <input
              type="number"
              name="habitaciones"
              value={formData.habitaciones}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Baños</label>
            <input
              type="number"
              name="banos"
              value={formData.banos}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Estacionamientos
            </label>
            <input
              type="number"
              name="estacionamientos"
              value={formData.estacionamientos}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Espacio Construido (m²)
            </label>
            <input
              type="number"
              name="construido_m2"
              value={formData.construido_m2}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Terreno Total (m²)
            </label>
            <input
              type="number"
              name="terreno_m2"
              value={formData.terreno_m2}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium">Piscina</label>
            <select
              name="piscina"
              value={formData.piscina}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Quincho</label>
            <select
              name="quincho"
              value={formData.quincho}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Mascotas</label>
            <select
              name="mascotas"
              value={formData.mascotas}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <select
              name="ciudad_id"
              value={formData.ciudad_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="">Seleccione ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Estado</label>
            <select
              name="estado_id"
              value={formData.estado_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="">Seleccione estado</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              name="tipo_id"
              value={formData.tipo_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-sm"
            >
              <option value="">Seleccione tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Imágenes (hasta 10)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.imagenes.map((img, idx) => (
            <div
              key={idx}
              className={`relative w-24 h-24 border-2 ${
                formData.imagenDestacada === idx
                  ? "border-blue-500"
                  : "border-gray-300"
              } rounded overflow-hidden`}
            >
              <img
                src={
                  img.file
                    ? img.url
                    : `${import.meta.env.VITE_BASE_URL}${img.url}`
                } // Construir la URL completa
                alt={`preview-${idx}`}
                className="object-cover w-full h-full cursor-pointer"
                onClick={() => handleDestacadaSelect(idx)}
              />
              <button
                type="button"
                onClick={() => eliminarImagenActual(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 text-xs"
              >
                X
              </button>
              {formData.imagenDestacada === idx && (
                <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          {propiedadEditada ? "Guardar Cambios" : "Crear Propiedad"}
        </button>
      </form>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Propiedades existentes</h2>
        <ul className="space-y-2 max-h-[600px] overflow-y-auto">
          {propiedades.map((prop) => (
            <li
              key={prop.id}
              className="border-b pb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{prop.titulo}</p>
                <p className="text-sm text-gray-600">{prop.descripcion}</p>
              </div>
              <button
                onClick={() => handleEditar(prop.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateProperty;
