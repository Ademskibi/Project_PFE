import User from "../models/User.js";
import Department from "../models/Department.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("departmentId", "name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching users", error: error.message });
  }
};


export const createUser = async (req, res) => {
  try {
    const { userId, name, email, password, departmentId, role } = req.body;

    // ✅ Validate required fields
    if (!userId || !name || !email || !password || !role || !departmentId) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }


    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists" });
    }

    // ✅ Ensure the department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({ message: "❌ Department not found" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      userId,
      name,
      email,
      password: hashedPassword,
      departmentId,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "✅ User created successfully", user: newUser });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "❌ Internal server error", error: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { userId, id } = req.body;

    if (!userId && !id) {
      return res.status(400).json({ message: "❌ Either userId or id is required" });
    }

    let deletedUser;
    if (id) {
      deletedUser = await User.findByIdAndDelete(id);
    } else {
      deletedUser = await User.findOneAndDelete({ userId });
    }

    if (!deletedUser) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    res.json({ message: "✅ User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting user", error: error.message });
  }
};

// ✅ UPDATE USER FUNCTION
export const updateUser = async (req, res) => {
  try {
    const { userId, id, name, email, password, departmentName, role } = req.body;

    if (!userId && !id) {
      return res.status(400).json({ message: "❌ Either userId or id is required" });
    }

    let user;
    if (id) {
      user = await User.findById(id);
    } else {
      user = await User.findOne({ userId });
    }

    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    if (departmentName) {
      const department = await Department.findOne({ name: departmentName });
      if (!department) {
        return res.status(400).json({ message: "❌ Department not found" });
      }
      user.departmentId = department._id;
    }

    await user.save();
    res.json({ message: "✅ User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating user", error: error.message });
  }
};
export const getUsersByRole = async (req, res) => {
    try {
      const { role } = req.body;
  
      if (!role) {
        return res.status(400).json({ message: "❌ Role is required" });
      }
  
      const users = await User.find({ role }).populate("departmentId", "name");
  
      if (users.length === 0) {
        return res.status(404).json({ message: "❌ No users found for this role" });
      }
  
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "❌ Error fetching users by role", error: error.message });
    }
  };
