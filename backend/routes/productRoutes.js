import express from "express";

import {
  getProducts,
  getFeaturedProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
} from "../controllers/productController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();
/*router.get("/", getProducts);
router.post("/", createProduct);

router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);*/


//same url different methods 

router.get("/featured", getFeaturedProducts);
router.get("/admin", protect, isAdmin, getAdminProducts);

router
  .route("/")
  .get(getProducts)
  .post(protect, isAdmin, upload.single("image"), createProduct);

router.patch("/:id/feature", protect, isAdmin, toggleFeatured);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, isAdmin, upload.single("image"), updateProduct)
  .delete(protect, isAdmin, deleteProduct);

export default router;
