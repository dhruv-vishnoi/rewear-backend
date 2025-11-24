console.log("🔥 CLEAN BACKEND STARTED 🔥");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./productRoutes");
const authRoutes = require("./authRoutes");
const swapRoutes = require("./swapRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Mounting product routes…");
app.use("/api/products", productRoutes);

console.log("Mounting auth routes…");
app.use("/api/auth", authRoutes);

console.log("Mounting swap routes…");
app.use("/api/swaps", swapRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
const path = require("path");


