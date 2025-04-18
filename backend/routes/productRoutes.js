import express from "express";
import { getAllProducts ,createProduct, getAProduct,getAvailableProducts ,deleteProduct , getProductsByCategory,updateProductStock} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.post("/create_product", createProduct);
router.post("/Product", getAProduct);
router.post("/delete",deleteProduct);
router.get("/products/category/:categoryId", getProductsByCategory); 
router.put("/products/update", updateProductStock); 
router.get("/products/available", getAvailableProducts);

export default router;
