import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/firebaseConfig.js";
import dotenv from "dotenv";
import cors from "cors";
import { verifyUser } from "../middleware/authmiddle.js";
dotenv.config();

const UserRouter = express.Router();
UserRouter.use(cors());

// Function to generate JWT token
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// **User Signup**
UserRouter.post("/signup", verifyUser, async (req, res) => {
  try {
    const { uid, username, email } = req.user; // Get user details from Firebase token

    // Save user details to your database (if needed)
    const newUser = { uid, username, email }; // Store in Firebase Firestore or another DB
    console.log("User signed up:", newUser);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
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

export default UserRouter;