import React, { useState } from "react";
import Navbar from "../components/NavBar"; // Importa correctamente el Navbar
import Footer from "../components/Footer"; // Importa correctamente el Footer

const Contacto = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/contacto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("Mensaje enviado con éxito");
        setFormData({ nombre: "", email: "", telefono: "", mensaje: "" }); // Limpiar el formulario
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
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Contenido Principal */}
      <div className="contact-page bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-blue-900 mt-20 mb-8">
            Contáctenos
          </h1>
          {/* Información del Representante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulario de Contacto */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Envíenos un mensaje
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Mensaje
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-300"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Información del Representante */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Información de Contacto
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Representante:</strong> Jorge Orellana
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:juan.perez@santodomingopropiedades.cl"
                  className="text-blue-600 hover:underline"
                >
                  jorge.orellana@sdpropiedades.cl
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Teléfono:</strong>{" "}
                <a
                  href="tel:+56912345678"
                  className="text-blue-600 hover:underline"
                >
                  +56 9 6818 5099{" "}
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Dirección:</strong> Santo Domingo, Chile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contacto;
