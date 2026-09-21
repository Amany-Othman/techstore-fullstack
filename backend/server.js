// Must be the FIRST import: loads .env before any other module reads process.env
import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import dns from "node:dns";
import multer from "multer";

import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Local-only DNS workaround
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8"]);
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Serve uploaded product images
app.use("/uploads", express.static(path.resolve("uploads")));

app.use(testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello from TechStore Backend!");
});

// Turn upload/validation errors into clean JSON instead of an HTML stack trace
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image is too large (max 5MB)"
        : err.message;

    return res.status(400).json({ message });
  }

  if (err) {
    return res.status(400).json({ message: err.message || "Request failed" });
  }

  next();
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
