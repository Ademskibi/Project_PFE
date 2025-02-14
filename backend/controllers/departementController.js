import Department from "../models/Department.js";

import dotenv from "dotenv";

dotenv.config();

// ✅ Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching departments", error: error.message });
  }
};

// ✅ Get a single department by ID or Name
export const getADepartment = async (req, res) => {
  try {
    const { name, departmentId } = req.body;

    if (!name && !departmentId) {
      return res.status(400).json({ message: "❌ Either name or departmentId is required" });
    }

    let department;
    if (departmentId) {
      department = await Department.findOne({ departmentId });
    } else {
      department = await Department.findOne({ name });
    }

    if (!department) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching department", error: error.message });
  }
};

// ✅ Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { departmentId, name } = req.body;

    if (!departmentId || !name) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    const existingDepartment = await Department.findOne({ departmentId });
    if (existingDepartment) {
      return res.status(400).json({ message: "❌ Department already exists" });
    }

    const newDepartment = new Department({ departmentId, name });

    await newDepartment.save();
    res.status(201).json({ message: "✅ Department created successfully", department: newDepartment });

  } catch (error) {
    res.status(500).json({ message: "❌ Error creating department", error: error.message });
  }
};

// ✅ Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { departmentId, id } = req.body;

    if (!departmentId && !id) {
      return res.status(400).json({ message: "❌ Either departmentId or ID is required" });
    }

    let deletedDepartment;
    if (id) {
      deletedDepartment = await Department.findByIdAndDelete(id);
    } else {
      deletedDepartment = await Department.findOneAndDelete({ departmentId });
    }

    if (!deletedDepartment) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    res.json({ message: "✅ Department deleted successfully", department: deletedDepartment });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting department", error: error.message });
  }
};
