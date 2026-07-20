import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes.js";

import Product from "./models/Product.js";

import dns from "node:dns";

dns.setServers(["8.8.8.8"]);

dotenv.config();
const app = express();
app.use(express.json());
app.use(testRoutes);

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hello from TechStore Backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


mongoose
  .connect(process.env.MONGO_URI)
 .then(() => {
  console.log("MongoDB connected");
})