import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: [
      "Phones",
      "Laptops",
      "Tablets",
      "Headphones",
      "Accessories",
      "Gaming",
      "Smart Watches",
    ],
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  // --- Admin control ---

  // Shows in the Home page "Featured Products" section
  isFeatured: {
    type: Boolean,
    default: false,
  },

  // Lower number = shown first inside the featured section
  featuredOrder: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
