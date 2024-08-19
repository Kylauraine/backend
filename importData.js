const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv"); // Importation de dotenv

dotenv.config(); // Chargement des variables d'environnement

const Book = require("./models/Book");

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connexion à MongoDB réussie, gg !");

    // Chemin absolu vers le fichier data.json
    const dataPath = path.join(__dirname, "../frontend/public/data/data.json");

    // Lire le fichier data.json
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // Insérer les données dans la collection 'books'
    return Book.insertMany(data);
  })
  .then((result) => {
    console.log("Données importées avec succès !");
    console.log(result);
  })
  .catch((error) => {
    console.log("Erreur lors de l'importation des données :", error);
  })
  .finally(() => {
    mongoose.connection.close();
  });
