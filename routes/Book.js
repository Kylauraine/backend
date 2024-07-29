const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload, convertToWebp } = require("../middleware/multer-config");

const bookCtrl = require("../controllers/Book");

// Nouvelle route pour obtenir les trois meilleurs livres
router.get("/bestrating", bookCtrl.bestRating);

// Route pour créer un livre avec une image
router.post("/", auth, upload, convertToWebp, bookCtrl.createBook);

// Route pour mettre à jour un livre avec une image
router.put("/:id", auth, upload, convertToWebp, bookCtrl.updateOneBook);

// Route pour supprimer un livre
router.delete("/:id", auth, bookCtrl.deleteOneBook);

// Nouvelle route pour noter un livre
router.post("/:id/rating", auth, bookCtrl.rateBook);

// Route pour obtenir un livre par son ID
router.get("/:id", bookCtrl.getOneBook);

// Route pour obtenir tous les livres
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
