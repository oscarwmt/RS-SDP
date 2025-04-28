// backend/src/controllers/catalogosController.js
const db = require("../db");

// Consulta inicial para tipos (mantenida como ejemplo)
(async () => {
  try {
    const result = await db.query("SELECT * FROM tipos ORDER BY nombre");
    console.log("Consulta tipos completada:", result.rows);
  } catch (error) {
    console.error("Error al consultar tipos:", error);
  }
})();

// Obtener ciudades
exports.obtenerCiudades = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM ciudades ORDER BY nombre");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
    res.status(500).json({ message: "Error al obtener ciudades" });
  }
};

// Obtener estados
exports.obtenerEstados = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM estados ORDER BY nombre ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({ message: "Error al obtener estados" });
  }
};

// Obtener tipos
exports.obtenerTipos = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tipos ORDER BY nombre ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tipos:", error);
    res.status(500).json({ message: "Error al obtener tipos" });
  }
};

// Obtener monedas
exports.obtenerMonedas = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM monedas ORDER BY nombre ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener monedas:", error);
    res.status(500).json({ message: "Error al obtener monedas" });
  }
};

// Obtener todos los catálogos
exports.obtenerCatalogos = async (req, res) => {
  try {
    const [ciudadesResult, estadosResult, tiposResult, monedasResult] =
      await Promise.all([
        db.query("SELECT * FROM ciudades ORDER BY nombre"),
        db.query("SELECT * FROM estados ORDER BY nombre"),
        db.query("SELECT * FROM tipos ORDER BY nombre"),
        db.query("SELECT * FROM monedas ORDER BY nombre"),
      ]);

    res.json({
      ciudades: ciudadesResult.rows,
      estados: estadosResult.rows,
      tipos: tiposResult.rows,
      monedas: monedasResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener catálogos:", error);
    res.status(500).json({ message: "Error al obtener catálogos" });
  }
};
