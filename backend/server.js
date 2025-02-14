import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js"; // Import DB connection
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import departementRoutes from "./routes/departementRoutes.js"
dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.use("/api/", userRoutes);
app.use("/api/", authRoutes);
app.use("/api/",productRoutes)
app.use("/api/",departementRoutes)
// Welcome Route
app.get("/", (req, res) => res.send("Welcome to the MERN API!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
