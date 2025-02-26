import User from "../models/User.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.status(200).json({ message: "✅ Login successful", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); 
    res.status(200).json({ message: "✅ Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error" });
  }
};
