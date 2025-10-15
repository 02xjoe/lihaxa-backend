import dotenv from "dotenv";
dotenv.config();
console.log("Loaded .env file");

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import waitlistRoutes from "./routes/waitlist.js";

const app = express();


const allowedOrigins = [
  "https://lihaxa.netlify.app",   // your frontend live domain
  "http://localhost:5173",        // for local dev (Vite)
  "http://localhost:3000"         // for local dev (CRA)
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));


app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", waitlistRoutes);
app.get("/", (req, res) => res.send("Lihaxa Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


