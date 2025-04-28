const bcrypt = require("bcryptjs");

const generateHash = async () => {
  try {
    console.log("Iniciando generación de hash...");
    const password = "Ticex2021"; // Contraseña base
    const saltRounds = 10; // Número de rondas de salt
    console.log("Generando hash para la contraseña:", password);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hash generado:", hashedPassword);
  } catch (error) {
    console.error("Error al generar el hash:", error);
  }
};

generateHash();
