const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

// Charger les variables d'environnement
dotenv.config();

// Middleware pour Helmet
app.use(helmet());

app.use(express.json());

// Middleware pour CORS avec le package `cors`
app.use(cors());

const booksRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie, gg !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

// Routes
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
