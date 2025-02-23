import Category from "../models/Category.js";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

// 📌 Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, items } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "❌ Category already exists" });
        }

        const newCategory = new Category({ name, items });
        await newCategory.save();

        res.status(201).json({ success: true, message: "✅ Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error creating category", error: error.message });
    }
};

// 📌 Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate("items").lean();

        if (!categories.length) {
            return res.status(404).json({ success: false, message: "❌ No categories found" });
        }

        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error retrieving categories", error: error.message });
    }
};

// 📌 Get a category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "❌ Invalid category ID" });
        }

        const category = await Category.findById(id).populate("items");
        if (!category) {
            return res.status(404).json({ success: false, message: "❌ Category not found" });
        }

        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error retrieving category", error: error.message });
    }
};

// 📌 Update a category by ID
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "❌ Invalid category ID" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "❌ Category not found" });
        }

        res.status(200).json({ success: true, message: "✅ Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error updating category", error: error.message });
    }
};

// 📌 Delete a category by ID
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "❌ Invalid category ID" });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "❌ Category not found" });
        }

        res.status(200).json({ success: true, message: "✅ Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error deleting category", error: error.message });
    }
};
