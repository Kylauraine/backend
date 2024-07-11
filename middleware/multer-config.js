const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Définir les types MIME des images acceptées
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Configurer Multer pour utiliser la mémoire pour stocker temporairement les fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

// Middleware pour convertir les images en .webp
const convertToWebp = async (req, res, next) => {
  if (!req.file) return next(); // Passer au middleware suivant s'il n'y a pas de fichier

  try {
    // Convertir l'image en format .webp et 600x600px max
    const buffer = await sharp(req.file.buffer).resize({ width: 600, height: 600, fit: "inside" }).webp({ quality: 80 }).toBuffer();

    // Générer un nom de fichier pour l'image .webp
    const name = req.file.originalname.split(" ").join("_");
    const newFilename = name + Date.now() + ".webp";
    const filePath = path.join("images", newFilename);

    // Sauvegarder l'image .webp dans le dossier images
    fs.writeFileSync(filePath, buffer);

    // Attacher les informations du fichier à l'objet req.file
    req.file.path = filePath;
    req.file.filename = newFilename;
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, convertToWebp };
