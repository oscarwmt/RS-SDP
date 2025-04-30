const pool = require("../db");

const getAllPropiedades = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM propiedades");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear una propiedad
const createPropiedad = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      direccion,
      precio,
      moneda_id,
      ciudad_id,
      estado_id,
      tipo_id,
      habitaciones,
      banos,
      estacionamientos,
      construido_m2,
      terreno_m2,
      piscina,
      quincho,
      mascotas,
      destacada,
    } = req.body;

    console.log("Datos recibidos en createPropiedad:", req.body);
    console.log("Archivos subidos:", req.files);

    const usuarioId = req.user.id;

    // Convertir valores booleanos ("si" / "no") a "si" o "no"
    const parseStringBoolean = (value) =>
      value === "si" || value === true ? "si" : "no";

    const nuevaPiscina = parseStringBoolean(piscina);
    const nuevoQuincho = parseStringBoolean(quincho);
    const nuevasMascotas = parseStringBoolean(mascotas);

    // Convertir destacada a booleano
    const nuevaDestacada = destacada === "si" || destacada === true;

    const nuevasImagenes = req.files.map((file) => file.filename);
    console.log("Imágenes subidas:", nuevasImagenes);

    let imagenDestacadaId = null;

    // Si se subieron imágenes, asignar la primera como imagen destacada
    if (nuevasImagenes.length > 0) {
      const result = await pool.query(
        `INSERT INTO imagenes (url) VALUES ($1) RETURNING id`,
        [`/uploads/${nuevasImagenes[0]}`]
      );
      imagenDestacadaId = result.rows[0].id;
      console.log("Imagen destacada insertada con ID:", imagenDestacadaId);
    }

    // Insertar la propiedad con la imagen destacada
    const query = `
      INSERT INTO propiedades (
        titulo, descripcion, direccion, precio, moneda_id, ciudad_id, estado_id, tipo_id,
        habitaciones, banos, estacionamientos, construido_m2, terreno_m2,
        piscina, quincho, mascotas, destacada, imagen_destacada_id, usuario_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *;
    `;

    const values = [
      titulo?.trim(),
      descripcion?.trim(),
      direccion?.trim(),
      parseFloat(precio),
      parseInt(moneda_id),
      parseInt(ciudad_id),
      parseInt(estado_id),
      parseInt(tipo_id),
      parseInt(habitaciones),
      parseInt(banos),
      parseInt(estacionamientos),
      parseInt(construido_m2),
      parseInt(terreno_m2),
      nuevaPiscina,
      nuevoQuincho,
      nuevasMascotas,
      nuevaDestacada,
      imagenDestacadaId,
      usuarioId,
    ];

    const result = await pool.query(query, values);
    const nuevaPropiedad = result.rows[0];
    console.log("Propiedad creada:", nuevaPropiedad);

    // Actualizar la imagen destacada para asignarle el propiedad_id
    if (imagenDestacadaId) {
      await pool.query(`UPDATE imagenes SET propiedad_id = $1 WHERE id = $2`, [
        nuevaPropiedad.id,
        imagenDestacadaId,
      ]);
      console.log(
        "Imagen destacada actualizada con propiedad_id:",
        nuevaPropiedad.id
      );
    }

    // Insertar las imágenes adicionales (excepto la destacada)
    if (nuevasImagenes.length > 1) {
      const inserts = nuevasImagenes.slice(1).map((nombreArchivo) => {
        console.log(
          "Insertando imagen:",
          nombreArchivo,
          "para la propiedad:",
          nuevaPropiedad.id
        );
        return pool.query(
          `INSERT INTO imagenes (propiedad_id, url) VALUES ($1, $2)`,
          [nuevaPropiedad.id, `/uploads/${nombreArchivo}`]
        );
      });
      await Promise.all(inserts);
    }

    res.status(201).json(nuevaPropiedad);
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar una propiedad
const updatePropiedad = async (req, res) => {
  try {
    const { id } = req.params; // ID de la propiedad a actualizar
    const {
      titulo,
      descripcion,
      direccion,
      precio,
      moneda_id,
      ciudad_id,
      estado_id,
      tipo_id,
      habitaciones,
      banos,
      estacionamientos,
      construido_m2,
      terreno_m2,
      piscina,
      quincho,
      mascotas,
      destacada,
      imagen_destacada_id, // Nuevo campo para la imagen destacada
    } = req.body;

    console.log("Datos recibidos para actualizar:", req.body);
    console.log("Archivos subidos:", req.files);

    // Convertir valores booleanos ("si" / "no") a "si" o "no"
    const parseStringBoolean = (value) =>
      value === "si" || value === true ? "si" : "no";

    const nuevaPiscina = parseStringBoolean(piscina);
    const nuevoQuincho = parseStringBoolean(quincho);
    const nuevasMascotas = parseStringBoolean(mascotas);

    // Convertir destacada a booleano
    const nuevaDestacada = destacada === "si" || destacada === true;

    // Actualizar la propiedad en la base de datos
    const query = `
      UPDATE propiedades
      SET
        titulo = $1,
        descripcion = $2,
        direccion = $3,
        precio = $4,
        moneda_id = $5,
        ciudad_id = $6,
        estado_id = $7,
        tipo_id = $8,
        habitaciones = $9,
        banos = $10,
        estacionamientos = $11,
        construido_m2 = $12,
        terreno_m2 = $13,
        piscina = $14,
        quincho = $15,
        mascotas = $16,
        destacada = $17,
        imagen_destacada_id = $18 -- Actualizar la imagen destacada
      WHERE id = $19
      RETURNING *
    `;

    const values = [
      titulo?.trim(),
      descripcion?.trim(),
      direccion?.trim(),
      parseFloat(precio),
      parseInt(moneda_id),
      parseInt(ciudad_id),
      parseInt(estado_id),
      parseInt(tipo_id),
      parseInt(habitaciones),
      parseInt(banos),
      parseInt(estacionamientos),
      parseInt(construido_m2),
      parseInt(terreno_m2),
      nuevaPiscina,
      nuevoQuincho,
      nuevasMascotas,
      nuevaDestacada,
      parseInt(imagen_destacada_id), // Nueva imagen destacada
      id,
    ];

    const result = await pool.query(query, values);
    const propiedadActualizada = result.rows[0];
    console.log("Propiedad actualizada:", propiedadActualizada);

    // Manejar las imágenes nuevas
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = req.files.map((file) => file.filename);

      // Insertar las imágenes nuevas en la base de datos
      const inserts = nuevasImagenes.map((nombreArchivo) => {
        console.log(
          "Insertando imagen:",
          nombreArchivo,
          "para la propiedad:",
          propiedadActualizada.id
        );
        return pool.query(
          `INSERT INTO imagenes (propiedad_id, url) VALUES ($1, $2)`,
          [propiedadActualizada.id, `/uploads/${nombreArchivo}`]
        );
      });

      await Promise.all(inserts);
    }

    res.status(200).json(propiedadActualizada);
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const deletePropiedad = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM propiedades WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    res.json({ mensaje: "Propiedad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getPropiedadById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM propiedades WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener la propiedad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getPropiedadById,
  getAllPropiedades,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
};
