import express from "express";
import { getAllProduct,createProduct, getAProduct ,deleteProduct} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProduct);
router.post("/create_product", createProduct);
router.get("/Product", getAProduct);
router.post("/delete",deleteProduct)

export default router;
