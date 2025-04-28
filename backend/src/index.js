// backend/src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const db = require("./db"); // Conexión a la base de datos
const propiedadesRoutes = require("./routes/propiedades");
const usuariosRoutes = require("./routes/usuarios");
const catalogosRoutes = require("./routes/catalogos");
const authRoutes = require("./routes/authRoutes"); // Rutas de autenticación
const imagenesRoutes = require("./routes/imagenesRoutes"); // Importar el nuevo router
const contactoRoutes = require("./routes/contactoRoutes"); // Importar las rutas de contacto

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173", // Permitir solicitudes desde el frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
  credentials: true, // Permitir envío de cookies o credenciales
};

app.use(cors(corsOptions)); // Usar configuración de CORS

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Servir imágenes

// Rutas
app.use("/api/propiedades", propiedadesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/catalogos", catalogosRoutes);
app.use("/api/auth", authRoutes); // Usar rutas de autenticación
app.use("/api/imagenes", imagenesRoutes); // Usar el nuevo router de imágenes
app.use("/api/contacto", contactoRoutes); // Usar las rutas de contacto

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Real State API running ✅");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
