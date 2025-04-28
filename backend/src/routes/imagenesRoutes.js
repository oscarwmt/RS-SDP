// src/routes/imagenesRoutes.js
const express = require("express");
const db = require("../db"); // Importa la conexión a la base de datos
const fs = require("fs"); // Para manejar archivos en el sistema de archivos
const path = require("path"); // Para construir rutas de archivos

const router = express.Router();

// Ruta para obtener imágenes por propiedad_id
router.get("/", async (req, res) => {
  try {
    const { propiedad_id } = req.query;

    if (!propiedad_id) {
      return res
        .status(400)
        .json({ message: "Falta el parámetro propiedad_id" });
    }

    // Consultar las imágenes asociadas a la propiedad en la base de datos
    const query = `
        SELECT id, url, propiedad_id 
        FROM imagenes 
        WHERE propiedad_id = $1
      `;
    const values = [propiedad_id];

    const result = await db.query(query, values);

    res.json(result.rows); // Devuelve todas las filas de resultados
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para obtener una imagen específica por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Consultar la imagen en la base de datos
    const query = `
        SELECT id, url 
        FROM imagenes 
        WHERE id = $1
      `;
    const values = [id];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    res.json(result.rows[0]); // Devuelve la primera fila de resultados
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para eliminar una imagen por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la información de la imagen antes de eliminarla
    const queryGetImage = `
        SELECT url, propiedad_id 
        FROM imagenes 
        WHERE id = $1
      `;
    const resultGetImage = await db.query(queryGetImage, [id]);

    if (resultGetImage.rows.length === 0) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const { url } = resultGetImage.rows[0];

    // Eliminar la imagen de la base de datos
    const queryDeleteImage = `
        DELETE FROM imagenes 
        WHERE id = $1
      `;
    await db.query(queryDeleteImage, [id]);

    // Opcional: Eliminar la imagen del sistema de archivos si existe físicamente
    const filePath = path.join(__dirname, "../uploads", url.split("/").pop());
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Eliminar el archivo físico
    }

    res.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

module.exports = router;
