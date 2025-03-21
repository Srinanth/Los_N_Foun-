import express from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/AuthRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: "https://los-n-foun.vercel.app", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", UserRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
