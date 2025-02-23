import express from "express";
import { getAllProducts ,createProduct, getAProduct ,deleteProduct , getProductsByCategory} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.post("/create_product", createProduct);
router.get("/Product", getAProduct);
router.post("/delete",deleteProduct);
router.get("/Category",getProductsByCategory);
export default router;
