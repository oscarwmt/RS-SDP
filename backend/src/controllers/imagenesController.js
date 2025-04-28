const db = require("../db");

// Obtener imágenes por propiedad_id
exports.getImagenesByPropiedadId = async (req, res) => {
  try {
    const { propiedad_id } = req.query;

    if (!propiedad_id) {
      return res
        .status(400)
        .json({ message: "Falta el parámetro propiedad_id" });
    }

    const [imagenes] = await db.query(
      "SELECT id, url, propiedad_id FROM imagenes WHERE propiedad_id = ?",
      [propiedad_id]
    );

    res.json(imagenes);
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener una imagen específica por ID
exports.getImagenById = async (req, res) => {
  try {
    const { id } = req.params;

    const [imagen] = await db.query(
      "SELECT id, url, propiedad_id FROM imagenes WHERE id = ?",
      [id]
    );

    if (!imagen.length) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    res.json(imagen[0]);
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
