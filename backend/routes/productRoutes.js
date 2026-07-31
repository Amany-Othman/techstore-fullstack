import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";


import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/*router.get("/", getProducts);
router.post("/", createProduct);

router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);*/


//same url different methods 

router.route("/")
    .get(getProducts)
    .post(protect,isAdmin,createProduct);

router.route("/:id")
    .get(getProductById)
    .put(protect,isAdmin,updateProduct)
    .delete(protect,isAdmin,deleteProduct);

export default router;