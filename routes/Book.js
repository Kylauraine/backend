const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload, convertToWebp } = require("../middleware/multer-config"); // Importer les middlewares

const bookCtrl = require("../controllers/Book");

// Route pour créer un livre avec une image
router.post("/", auth, upload, convertToWebp, bookCtrl.createBook);

// Route pour mettre à jour un livre avec une image
router.put("/:id", auth, upload, convertToWebp, bookCtrl.updateOneBook);

// Route pour supprimer un livre
router.delete("/:id", auth, bookCtrl.deleteOneBook);

// Route pour classer les livres par note moyenne
router.get("/bestrating", bookCtrl.bestRating);

// Route pour obtenir un livre par son ID
router.get("/:id", bookCtrl.getOneBook);

// Route pour obtenir tous les livres
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
