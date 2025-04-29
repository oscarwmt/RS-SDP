const express = require("express");
const db = require("../db"); // Importa la conexión a la base de datos
const {
  getPropiedadById,
  getAllPropiedades,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} = require("../controllers/propiedadesController");
const {
  getImagenesByPropiedadId,
  getImagenById,
} = require("../controllers/imagenesController");
const authenticateToken = require("../middlewares/authenticateToken");
const uploadImages = require("../middlewares/upload");

const router = express.Router();

// Obtener todas las propiedades
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
        p.*,
        i.url AS imagen_destacada_url
      FROM propiedades p
      LEFT JOIN imagenes i ON p.imagen_destacada_id = i.id
    `;
    const result = await db.query(query);

    console.log(" ACA  :  ", query, "FIN");

    console.log(" ACA  :  ", result.rows, "FIN");

    // Construir la URL completa para la imagen destacada
    const propiedades = result.rows.map((propiedad) => {
      const baseUrl = process.env.BASE_URL || "localhost:5001"; // Valor predeterminado si BASE_URL no está definido
      const fullUrl = propiedad.imagen_destacada_url
        ? `${baseUrl}${propiedad.imagen_destacada_url}`
        : null;

      // Imprimir la URL completa en la consola
      console.log("URL construida:", fullUrl);

      return {
        ...propiedad,
        imagen_destacada_url: fullUrl,
      };
    });

    res.json(propiedades);
  } catch (error) {
    console.error("Error al obtener las propiedades:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Obtener una propiedad por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        p.*,
        i.url AS imagen_destacada_url
      FROM propiedades p
      LEFT JOIN imagenes i ON p.imagen_destacada_id = i.id
      WHERE p.id = $1
    `;
    const values = [id];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    const propiedad = result.rows[0];
    const baseUrl = process.env.BASE_URL || "localhost:5001"; // Valor predeterminado si BASE_URL no está definido

    // Construir la URL completa para la imagen destacada
    if (propiedad.imagen_destacada_url) {
      propiedad.imagen_destacada_url = `${baseUrl}${propiedad.imagen_destacada_url}`;
    }

    // Imprimir la URL completa en la consola
    console.log(
      "URL construida para la propiedad:",
      propiedad.imagen_destacada_url
    );

    res.json(propiedad);
  } catch (error) {
    console.error("Error al obtener la propiedad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Crear una nueva propiedad (requiere autenticación y permite imágenes)
router.post("/", authenticateToken, uploadImages, createPropiedad);

// Actualizar una propiedad existente (requiere autenticación y permite imágenes)
router.put("/:id", authenticateToken, uploadImages, updatePropiedad);

// Ruta para obtener imágenes por propiedad_id
router.get("/api/imagenes", getImagenesByPropiedadId);

// Ruta para obtener una imagen específica por ID
router.get("/api/imagenes/:id", getImagenById);

// Eliminar una propiedad (requiere autenticación)
router.delete("/:id", authenticateToken, deletePropiedad);

// Buscar propiedades por filtros
router.get("/api/propiedades/search", async (req, res) => {
  try {
    const { tipo_id, ciudad_id } = req.query;

    let query = `
      SELECT
        p.*,
        i.url AS imagen_destacada_url,
        t.nombre AS tipo_nombre,
        c.nombre AS ciudad_nombre
      FROM propiedades p
      LEFT JOIN imagenes i ON p.imagen_destacada_id = i.id
      LEFT JOIN tipos t ON p.tipo_id = t.id
      LEFT JOIN ciudades c ON p.ciudad_id = c.id
      WHERE 1=1
    `;
    const values = [];

    if (tipo_id) {
      query += ` AND p.tipo_id = $${values.length + 1}`;
      values.push(tipo_id);
    }

    if (ciudad_id) {
      query += ` AND p.ciudad_id = $${values.length + 1}`;
      values.push(ciudad_id);
    }

    console.log("Consulta generada:", query); // Imprimir la consulta en consola
    console.log("Valores utilizados:", values); // Imprimir los valores utilizados

    const result = await db.query(query, values);

    // Construir la URL completa para la imagen destacada
    const propiedades = result.rows.map((propiedad) => ({
      ...propiedad,
      imagen_destacada_url: propiedad.imagen_destacada_url
        ? `${process.env.BASE_URL}${propiedad.imagen_destacada_url}`
        : null,
    }));

    res.json(propiedades);
  } catch (error) {
    console.error("Error al buscar propiedades:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
