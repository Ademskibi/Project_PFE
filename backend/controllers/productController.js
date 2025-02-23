import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const uploadMiddleware = upload.single("image");

// 🟢 Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching products", error: error.message });
  }
};

// 🔵 Get Single Product by name or itemId
export const getAProduct = async (req, res) => {
  try {
    const { name, itemId } = req.body;

    if (!name && !itemId) {
      return res.status(400).json({ message: "❌ Either name or itemId is required" });
    }

    let product;
    if (itemId) {
      product = await Product.findOne({ itemId }).populate("categoryId", "name");
    } else {
      product = await Product.findOne({ name }).populate("categoryId", "name");
    }

    if (!product) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching product", error: error.message });
  }
};

// 🔴 Create a Product (with Image Upload)
export const createProduct = async (req, res) => {
  try {
    const { itemId, name, categoryId, quantity } = req.body;

    if (!itemId || !name || !categoryId || !quantity) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    const existingProduct = await Product.findOne({ itemId });
    if (existingProduct) {
      return res.status(400).json({ message: "❌ Product already exists" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "❌ Category not found" });
    }

    let imgUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, uploadedImage) => {
            if (error) {
              reject(error);
            } else {
              resolve(uploadedImage.secure_url);
            }
          }
        ).end(req.file.buffer);
      });

      imgUrl = result;
    }

    const newProduct = new Product({
      itemId,
      name,
      categoryId,
      quantity,
      imgUrl,
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating product", error: error.message });
  }
};

// 🟠 Delete a Product
export const deleteProduct = async (req, res) => {
  try {
    const { itemId, id } = req.body;

    if (!itemId && !id) {
      return res.status(400).json({ message: "❌ Either itemId or id is required" });
    }

    let deletedProduct;
    if (id) {
      deletedProduct = await Product.findByIdAndDelete(id);
    } else {
      deletedProduct = await Product.findOneAndDelete({ itemId });
    }

    if (!deletedProduct) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    res.json({ message: "✅ Product deleted successfully", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting product", error: error.message });
  }
};

// 🟡 Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "❌ Category ID is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "❌ Category not found" });
    }

    const products = await Product.find({ categoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: "❌ No products found for this category" });
    }

    res.json({ category: category.name, products });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching products by category", error: error.message });
  }
};
