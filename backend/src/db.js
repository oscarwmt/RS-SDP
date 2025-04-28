// backend/src/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Validar que las variables de entorno estén definidas
if (
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOST ||
  !process.env.DB_NAME ||
  !process.env.DB_PORT
) {
  throw new Error(
    "Faltan variables de entorno necesarias para la conexión a la base de datos"
  );
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Convertir explícitamente a cadena
  port: parseInt(process.env.DB_PORT, 10), // Asegurarse de que el puerto sea un número
});

pool.on("connect", () => {
  console.log("Conectado a la base de datos");
});

pool.on("error", (err) => {
  console.error("Error en la conexión a la base de datos:", err); // 👈 Verifica si hay errores de conexión
});

module.exports = pool;
