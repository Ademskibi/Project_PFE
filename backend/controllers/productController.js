import Product from "../models/Product.js";
import Category from "../models/Category.js";
import dotenv from "dotenv";

dotenv.config();

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching products", error: error.message });
  }
};

export const getAProduct = async (req, res) => {
  try {
    const { name, itemId } = req.body; // Extract name and itemId from request

    if (!name && !itemId) {
      return res.status(400).json({ message: "❌ Either name or itemId is required" });
    }

    let product;
    if (itemId) {
      product = await Product.findOne({ itemId }).populate("categoryId", "name"); // ✅ Corrected query
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

    const newProduct = new Product({
      itemId,
      name,
      categoryId,
      quantity,
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating product", error: error.message });
  }
};

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
