const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Cambia esto según el servicio de correo que uses (Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASS, // Tu contraseña o una contraseña de aplicación
  },
});

// Ruta para manejar el envío del formulario de contacto
router.post("/", async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!nombre || !email || !mensaje) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  // Configurar el correo electrónico
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "sdpropiedadescl@gmail.com", // Correo al que se enviará el mensaje
    subject: `Nuevo mensaje de contacto de ${nombre}`,
    text: `
      Nombre: ${nombre}
      Email: ${email}
      Teléfono: ${telefono || "No proporcionado"}
      Mensaje: ${mensaje}
    `,
  };

  try {
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
});

module.exports = router;
