const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");

// Charger les variables d'environnement
dotenv.config();

// Middleware pour CORS avec le package `cors`
app.use(express.json()).use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie, gg !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

// Middleware pour Helmet
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const booksRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Routes
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
