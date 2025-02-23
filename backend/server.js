import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import departementRoutes from "./routes/departementRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import multer from "multer"; // Import multer for file uploads
import fs from "fs"; // File system module for cleaning up temporary files
import path from "path"; // Import path module for handling file paths

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to the database
connectDB();

// Ensure the 'public' directory exists
const uploadDir = "public";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Define multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/"); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Ensure a unique filename
    },
});

// Initialize multer with storage
const upload = multer({ storage });

// Cloudinary configuration
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary configured");

// Routes
app.use("/api/", userRoutes);
app.use("/api/", authRoutes);
app.use("/api/", productRoutes);
app.use("/api/", departementRoutes);
app.use("/api/", orderRoutes);
app.use("/api/", categoryRoutes);

// Image upload route
app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Log the file path for debugging
        console.log("Uploaded file path:", req.file.path);

        // Upload file to Cloudinary
        const result = await cloudinaryV2.uploader.upload(req.file.path, {
            folder: "products", // Optional: specify a folder in Cloudinary for image storage
        });

        // Clean up the temporary file after successful upload
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Return the secure URL
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            secure_url: result.secure_url,
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({
            error: "An error occurred during the upload",
        });
    }
});

// Welcome Route
app.get("/", (req, res) => res.send("Welcome to the MERN API!"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
