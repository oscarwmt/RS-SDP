import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateProperty.css"; // Importar el archivo CSS

const CreateProperty = () => {
  const { id } = useParams(); // ID de la propiedad si estamos editando
  const navigate = useNavigate();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    destacada: false,
    habitaciones: "",
    banos: "",
    estacionamientos: "",
    construido_m2: "",
    terreno_m2: "",
    piscina: "no", // Valor por defecto 'no'
    quincho: "no", // Valor por defecto 'no'
    mascotas: "no", // Valor por defecto 'no'
    direccion: "",
    tipo_id: "", // ID del tipo seleccionado
    moneda_id: "", // ID de la moneda seleccionada
    estado_id: "", // ID del estado seleccionado
    ciudad_id: "", // ID de la ciudad seleccionada
    usuario_id: "", // ID del usuario activo
    imagen_destacada_id: "",
  });

  // Obtener el ID del usuario activo al cargar el componente
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo")); // Ajusta esto según cómo almacenes el usuario activo
    if (usuarioActivo) {
      setFormData((prev) => ({
        ...prev,
        usuario_id: usuarioActivo.id, // Asignar el ID del usuario activo
      }));
    }
  }, []);

  // Estado para las imágenes y la imagen destacada
  const [imagenes, setImagenes] = useState([]);
  const [imagenDestacada, setImagenDestacada] = useState(null);

  // Estado para los catálogos
  const [catalogos, setCatalogos] = useState({
    tipos: [],
    monedas: [],
    estados: [],
    ciudades: [],
  });

  // Cargar los catálogos y los datos de la propiedad si estamos editando
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

    const fetchPropertyData = async () => {
      if (id) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/propiedades/${id}`
          );
          const data = await response.json();
          setFormData(data);

          // Cargar imágenes asociadas a la propiedad
          const imagenesResponse = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/imagenes?propiedad_id=${id}`
          );
          const imagenesData = await imagenesResponse.json();
          setImagenes(imagenesData);

          // Establecer la imagen destacada
          if (data.imagen_destacada_id) {
            const imagenDestacadaResponse = await fetch(
              `${import.meta.env.VITE_BASE_URL}/api/imagenes/${
                data.imagen_destacada_id
              }`
            );
            const imagenDestacadaData = await imagenDestacadaResponse.json();
            setImagenDestacada(imagenDestacadaData);
          }
        } catch (error) {
          console.error("Error al cargar los datos de la propiedad:", error);
        }
      }
    };

    fetchCatalogos();
    if (id) fetchPropertyData();
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "si" : "no") : value,
    });
  };

  // Manejar la carga de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convertir los archivos seleccionados en un array
    const newImages = files.map((file) => ({
      file, // El archivo original
      preview: URL.createObjectURL(file), // Crear una URL temporal para la vista previa
    }));

    // Agregar las nuevas imágenes al estado existente
    setImagenes((prev) => [...prev, ...newImages]);
  };

  // Establecer una imagen como destacada
  const handleSetFeaturedImage = (image) => {
    if (imagenDestacada?.id === image.id) {
      // Si la imagen ya es destacada, desmarcarla
      setImagenDestacada(null);
      setFormData({ ...formData, imagen_destacada_id: "" });
    } else {
      // Marcar la nueva imagen como destacada
      setImagenDestacada(image);
      setFormData({ ...formData, imagen_destacada_id: image.id });
    }
  };

  // Eliminar una imagen
  const handleDeleteImage = async (index) => {
    const imageToDelete = imagenes[index];

    // Si la imagen tiene un ID, significa que ya existe en la base de datos
    if (imageToDelete.id) {
      try {
        // Enviar una solicitud DELETE al backend para eliminar la imagen
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/imagenes/${imageToDelete.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar la imagen");
        }

        console.log("Imagen eliminada del backend:", imageToDelete.id);
      } catch (error) {
        console.error("Error al eliminar la imagen del backend:", error);
        alert(`No se pudo eliminar la imagen: ${error.message}`);
        return; // Detener la eliminación si falla el backend
      }
    }

    // Actualizar el estado local eliminando la imagen
    const updatedImages = imagenes.filter((_, i) => i !== index);
    setImagenes(updatedImages);

    // Si la imagen eliminada era la destacada, limpiar la selección
    if (imagenDestacada && imageToDelete.id === imagenDestacada.id) {
      setImagenDestacada(null);
      setFormData({ ...formData, imagen_destacada_id: "" });
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Agregar las imágenes al FormData
    imagenes.forEach((image, index) => {
      if (image.file) {
        formDataToSend.append("imagenes", image.file); // Usar el nombre 'imagenes' aquí
      }
    });

    try {
      const url = id
        ? `${import.meta.env.VITE_BASE_URL}/api/propiedades/${id}`
        : `${import.meta.env.VITE_BASE_URL}/api/propiedades`;
      const method = id ? "PUT" : "POST";

      // Obtener el token de autenticación
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert(
          id ? "Propiedad actualizada con éxito" : "Propiedad creada con éxito"
        );
        navigate("/admin/propiedades");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Ocurrió un error al procesar la solicitud.");
    }
  };

  return (
    <div className="create-property-form">
      <h2>{id ? "Editar Propiedad" : "Crear Propiedad"}</h2>
      <form onSubmit={handleSubmit}>
        {/* Información General */}
        <section className="form-section">
          <h3>Información General</h3>
          <div className="form-grid">
            <div>
              <label>Título:</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                maxLength="255"
                required
              />
            </div>
            <div>
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
              />
            </div>
            <div>
              <label>Moneda:</label>
              <select
                name="moneda_id"
                value={formData.moneda_id}
                onChange={handleChange}
              >
                <option value="">Selecciona una moneda</option>
                {catalogos.monedas.map((moneda) => (
                  <option key={moneda.id} value={moneda.id}>
                    {moneda.nombre} ({moneda.simbolo})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Propiedad Destacada:</label>
              <input
                type="checkbox"
                name="destacada"
                checked={formData.destacada === "si"}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Características de la Propiedad */}
        <section className="form-section">
          <h3>Características de la Propiedad</h3>
          <div className="form-grid">
            <div>
              <label>Habitaciones:</label>
              <input
                type="number"
                name="habitaciones"
                value={formData.habitaciones}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Baños:</label>
              <input
                type="number"
                name="banos"
                value={formData.banos}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Estacionamientos:</label>
              <input
                type="number"
                name="estacionamientos"
                value={formData.estacionamientos}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Construido (m²):</label>
              <input
                type="number"
                name="construido_m2"
                value={formData.construido_m2}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Terreno (m²):</label>
              <input
                type="number"
                name="terreno_m2"
                value={formData.terreno_m2}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Piscina:</label>
              <input
                type="checkbox"
                name="piscina"
                checked={formData.piscina === "si"}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Quincho:</label>
              <input
                type="checkbox"
                name="quincho"
                checked={formData.quincho === "si"}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Mascotas:</label>
              <input
                type="checkbox"
                name="mascotas"
                checked={formData.mascotas === "si"}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section className="form-section">
          <h3>Ubicación</h3>
          <div className="form-grid">
            <div>
              <label>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                maxLength="255"
              />
            </div>
            <div>
              <label>Ciudad:</label>
              <select
                name="ciudad_id"
                value={formData.ciudad_id}
                onChange={handleChange}
              >
                <option value="">Selecciona una ciudad</option>
                {catalogos.ciudades.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Estado:</label>
              <select
                name="estado_id"
                value={formData.estado_id}
                onChange={handleChange}
              >
                <option value="">Selecciona un estado</option>
                {catalogos.estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Tipo:</label>
              <select
                name="tipo_id"
                value={formData.tipo_id}
                onChange={handleChange}
              >
                <option value="">Selecciona un tipo</option>
                {catalogos.tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Descripción */}
        <section className="form-section">
          <h3>Descripción</h3>
          <div>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              maxLength="65535"
            />
          </div>
        </section>

        {/* Imágenes */}
        <section className="form-section">
          <h3>Imágenes</h3>
          <div>
            <label>Cargar imágenes:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div className="image-preview">
            {imagenes.map((image, index) => (
              <div key={index} className="image-item">
                {/* Imagen */}
                <img
                  src={
                    image.preview ||
                    `${import.meta.env.VITE_BASE_URL}${image.url}`
                  }
                  alt="Preview"
                  width="100"
                />
                {/* Botón Marcar como destacada */}
                <button
                  type="button"
                  className="featured-button"
                  onClick={() => handleSetFeaturedImage(image)}
                >
                  {imagenDestacada?.id === image.id
                    ? "Imagen Destacada"
                    : "Destacar"}
                </button>
                {/* Botón Eliminar */}
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteImage(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </section>

        <button type="submit">
          {id ? "Actualizar Propiedad" : "Crear Propiedad"}
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
