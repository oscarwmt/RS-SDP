// backend/src/routes/usuarios.js
const express = require("express");
const bcrypt = require("bcryptjs"); // Importar bcrypt para encriptar contraseñas
const db = require("../db");

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT id, nombre, email, creado_en
      FROM usuarios
      ORDER BY creado_en DESC; -- Ordenar por fecha de creación
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err.message); // Log detallado
    console.error("Detalles del error:", err.stack); // Stack trace
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Ruta para crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nombre, email y contraseña son requeridos" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos
    const query = `
      INSERT INTO usuarios (nombre, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, email, creado_en;
    `;
    const values = [nombre, email, hashedPassword];
    const { rows } = await db.query(query, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error al crear usuario:", err.message);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Ruta para eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar el usuario de la base de datos
    const query = "DELETE FROM usuarios WHERE id = $1 RETURNING id;";
    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente", id: rows[0].id });
  } catch (err) {
    console.error("Error al eliminar usuario:", err.message);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Ruta para actualizar un usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    // Validar que al menos un campo esté presente
    if (!nombre && !email && !password) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar al menos un campo para actualizar" });
    }

    // Construir la consulta dinámicamente
    const fields = [];
    const values = [];
    let index = 1;

    if (nombre) {
      fields.push(`nombre = $${index++}`);
      values.push(nombre);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      fields.push(`password_hash = $${index++}`);
      values.push(hashedPassword);
    }

    values.push(id); // Agregar el ID al final de los valores

    const query = `
      UPDATE usuarios
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, nombre, email, creado_en;
    `;

    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error al actualizar usuario:", err.message);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

module.exports = router;
