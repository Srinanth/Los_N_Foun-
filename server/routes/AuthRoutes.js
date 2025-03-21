import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/firebaseConfig.js";
import dotenv from "dotenv";
import { verifyUser } from "../middleware/authmiddle.js";
import cors from "cors"
dotenv.config();
const UserRouter = express.Router();
UserRouter.use(cors());
// Function to generate JWT token
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// **User Signup**
UserRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) return res.status(400).json({ error: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").doc(email).set({ username, email, password: hashedPassword });

    // Generate token after successful signup
    const token = generateToken(email);

    return res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// **User Login**
UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await db.collection("users").doc(email).get();

    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();
    const isValidPassword = await bcrypt.compare(password, userData.password);

    if (!isValidPassword) return res.status(401).json({ error: "Invalid credentials" });

    // Generate token after successful login
    const token = generateToken(email);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// **User Profile (Protected Route)**
UserRouter.get("/profile", verifyUser, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.email).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    return res.json({ user: userDoc.data() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default UserRouter;
