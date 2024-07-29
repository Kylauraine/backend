const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

const cors = require("cors");

dotenv.config();

const booksRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Middleware pour CORS avec le package `cors`
app.use(cors());

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
