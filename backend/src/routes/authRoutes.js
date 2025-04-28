// backend/src/routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows } = await db.query(query, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos" });
    }

    const user = rows[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos" });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre || "Usuario", // Asegurar un valor predeterminado si el nombre está vacío
      },
    });
  } catch (err) {
    console.error("Error al iniciar sesión:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
