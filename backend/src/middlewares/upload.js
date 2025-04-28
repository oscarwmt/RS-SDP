const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`); // Generar un nombre único para cada archivo
  },
});

// Middleware de multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (.jpg, .jpeg, .png, .webp)"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB por archivo
});

// Middleware específico para manejar múltiples imágenes con el campo 'imagenes'
const uploadImages = upload.array("imagenes", 10); // Aceptar hasta 10 imágenes

module.exports = uploadImages;
