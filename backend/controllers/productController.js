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


export const getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 🔵 Get Single Product by name or itemId
// Fix for GET by ID from URL
export const getAProduct = async (req, res) => {
  try {
    const { productId } = req.params; // get from URL params

    if (!productId) {
      return res.status(400).json({ message: "❌ Product ID is required" });
    }

    const product = await Product.findById(productId).populate("categoryId", "name");

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
    const { itemId, name, categoryId, stock, imgUrl } = req.body; // Extract these fields from the body

    // Check if required fields are provided
    if (!itemId || !name || !categoryId || !stock) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    // Check if the product already exists
    const existingProduct = await Product.findOne({ itemId });
    if (existingProduct) {
      return res.status(400).json({ message: "❌ Product already exists" });
    }

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "❌ Category not found" });
    }

    // If there's an image, upload it to Cloudinary
    let imageUrl = imgUrl || null; // Default to null if no image URL is provided

    const newProduct = new Product({
      itemId,
      name,
      categoryId,
      stock,
      imgUrl: imageUrl, // Save the image URL
    });

    // Save the new product to the database
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
    const { categoryId } = req.params; // ✅ Fix: Get categoryId from URL params

    if (!categoryId) {
      return res.status(400).json({ message: "❌ Category ID is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "❌ Category not found" });
    }

    const products = await Product.find({ categoryId });

    res.json({ category: category.name, products });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching products by category", error: error.message });
  }
};

// 🔵 Update Product Stock
export const updateProductStock = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "❌ 'updates' must be a non-empty array" });
    }

    const updatedProducts = [];

    for (const update of updates) {
      const { _id, stock, operator } = update;

      if (!_id || typeof stock !== "number") {
        return res.status(400).json({ message: "❌ _id and numeric stock are required" });
      }

      const product = await Product.findById(_id);

      if (!product) {
        return res.status(404).json({ message: `❌ Product not found: ${_id}` });
      }

      if (operator === "decrease") {
        if (product.stock < stock) {
          return res.status(400).json({ message: `❌ Not enough stock for product: ${product.name}` });
        }
        product.stock -= stock;
      } else {
        product.stock += stock;
      }

      await product.save();
      updatedProducts.push(product);
    }

    res.json({ message: "✅ Products updated", products: updatedProducts });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating stock", error: error.message });
  }
};