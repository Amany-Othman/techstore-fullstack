import Product from "../models/Product.js";
console.log(
  "isFeatured path:",
  Product.schema.path("isFeatured")
);
import { getUploadedImageUrl } from "../middleware/uploadMiddleware.js";

// How many products can be featured on the Home page at once
const FEATURED_LIMIT = 4;

// @desc    Public product list
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

// @desc    Featured products for the Home page
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true }).sort({
    featuredOrder: 1,
    createdAt: -1,
  });

  res.status(200).json(products);
};

// @desc    Admin product list with search / filter / pagination
// @route   GET /api/products/admin?search=&category=&page=1&limit=10
// @access  Private/Admin
export const getAdminProducts = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));

  const filter = {};

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const featuredCount = await Product.countDocuments({ isFeatured: true });

  res.status(200).json({
    products,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    total,
    featuredCount,
    featuredLimit: FEATURED_LIMIT,
  });
};

// @desc    Single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
};

// @desc    Create product (accepts multipart/form-data)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, description, price, category, stock, rating } = req.body;

  // image can come from an uploaded file OR a pasted URL
  const image = getUploadedImageUrl(req) || req.body.image;

  if (!name || !price || !category || !description || !image) {
    return res.status(400).json({
      message: "Name, description, price, category and image are required",
    });
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    image,
    category,
    stock: Number(stock) || 0,
    rating: Number(rating) || 0,
  });

  res.status(201).json(product);
};

// @desc    Update product (accepts multipart/form-data)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, rating } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const newImage = getUploadedImageUrl(req) || req.body.image;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.category = category ?? product.category;
  product.stock = stock !== undefined ? Number(stock) : product.stock;
  product.rating = rating !== undefined ? Number(rating) : product.rating;

  if (newImage) {
    product.image = newImage;
  }

  await product.save();

  res.status(200).json(product);
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully" });
};

// @desc    Toggle featured flag (enforces the featured limit)
// @route   PATCH /api/products/:id/feature
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Turning it ON -> check we're not over the limit
  if (!product.isFeatured) {
    const featuredCount = await Product.countDocuments({ isFeatured: true });

    if (featuredCount >= FEATURED_LIMIT) {
      return res.status(400).json({
        message: `Featured limit reached (${FEATURED_LIMIT}) — unfeature a product first`,
      });
    }

    product.isFeatured = true;
    product.featuredOrder = featuredCount; // append to the end of the row
  } else {
    product.isFeatured = false;
    product.featuredOrder = 0;
  }

  await product.save();

  res.status(200).json(product);
};
