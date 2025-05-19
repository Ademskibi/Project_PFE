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
import notificationRoutes from "./routes/notificationRoutes.js"
import multer from "multer"; // Import multer for file uploads
import fs from "fs"; // File system module for cleaning up temporary files
import path from "path"; // Import path module for handling file paths
import adminRoutes from "./routes/adminRoutes.js"
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

const storage = multer.memoryStorage();
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
app.use("/api/", notificationRoutes);
<<<<<<< HEAD
=======

app.use("/api",adminRoutes );

>>>>>>> a716f8ede7e3297837565910e8ee6c069239b6c3
app.use("/api/stats",adminRoutes );
// Image upload route

app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Convert image buffer to base64
        const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await cloudinaryV2.uploader.upload(base64String, {
            folder: "products",
            resource_type: "auto",
        });

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            secure_url: result.secure_url,
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "An error occurred during the upload" });
    }
});


// Welcome Route
app.get("/", (req, res) => res.send("Welcome to the MERN API!"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
