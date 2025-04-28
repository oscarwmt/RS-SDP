// backend/src/routes/catalogos.js
const express = require("express");
const {
  obtenerCiudades,
  obtenerEstados,
  obtenerTipos,
  obtenerMonedas,
} = require("../controllers/catalogosController");
const catalogosController = require("../controllers/catalogosController");

const router = express.Router();

// Rutas para obtener datos de catálogos
router.get("/ciudades", obtenerCiudades);
router.get("/estados", obtenerEstados);
router.get("/tipos", obtenerTipos);
router.get("/monedas", obtenerMonedas);
router.get("/catalogos", catalogosController.obtenerCatalogos);

module.exports = router;
