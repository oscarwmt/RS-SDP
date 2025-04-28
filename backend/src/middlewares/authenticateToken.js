const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token recibido:", token);

  if (!token) {
    console.warn("Token no proporcionado en la solicitud.");
    return res
      .status(401)
      .json({ error: "Acceso denegado. Token no proporcionado." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Error al verificar el token:", err.message);
      return res.status(403).json({ error: "Token inválido o expirado." });
    }
    console.log("Token verificado correctamente. Usuario:", user);
    req.user = user; // Adjuntar el usuario al request
    next();
  });
};

module.exports = authenticateToken;
