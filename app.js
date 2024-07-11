const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const booksRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const path = require("path");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

mongoose
  .connect("mongodb+srv://test:test01@clustertest.ftngaih.mongodb.net/?retryWrites=true&w=majority&appName=Clustertest")
  .then(() => console.log("Connexion à MongoDB réussie, gg !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
