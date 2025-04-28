// src/services/propertyService.js
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createProperty = async (propertyData) => {
  const token = localStorage.getItem("token"); // Obtener el token JWT
  const response = await fetch(`${BASE_URL}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
    },
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    throw new Error("Error al crear la propiedad");
  }

  return await response.json();
};
