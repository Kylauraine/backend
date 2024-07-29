const Book = require("../models/Book");
const fs = require("fs");

// Créer un nouveau livre
exports.createBook = async (req, res, next) => {
  try {
    console.log("Requête reçue:", req.body);
    const bookObject = req.body.book ? JSON.parse(req.body.book) : req.body;
    console.log("Objet livre:", bookObject);
    delete bookObject._id;
    delete bookObject._userId;

    // Créer un livre avec l'image convertie en .webp si présente
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : "",
    });

    await book.save();
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    console.error("Erreur lors de la création du livre:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un livre existant
exports.updateOneBook = async (req, res, next) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };

    delete bookObject._userId;

    const book = await Book.findOne({ _id: req.params.id });
    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: "Vous n'avez pas l'autorisation" });
    }

    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      const oldFilename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${oldFilename}`, (err) => {
        if (err) console.error("Erreur lors de la suppression de l'image:", err);
      });
    }

    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
    res.status(200).json({ message: "Livre modifié !" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du livre:", error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un livre
exports.deleteOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Vous n'avez pas l'autorisation" });
      }

      // Supprimer l'image associée si elle existe
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) console.error("Erreur lors de la suppression de l'image:", err);
      });

      // Supprimer le livre
      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Livre supprimé !" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Controllers/Book.js

exports.bestRating = (req, res, next) => {
  Book.find()
    .then((books) => {
      // Trier les livres par averageRating en ordre décroissant
      const sortedBooks = books.sort((a, b) => b.averageRating - a.averageRating);
      // Prendre les 3 premiers livres
      const topRatedBooks = sortedBooks.slice(0, 3);
      res.status(200).json(topRatedBooks);
    })
    .catch((error) => res.status(400).json({ error }));
};

// Obtenir un livre par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Obtenir tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
