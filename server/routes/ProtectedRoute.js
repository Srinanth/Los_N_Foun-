import express from "express";
import { verifyUser } from "../middleware/authmiddle.js";
import { db } from "../config/firebaseConfig.js";

const ProtectedRouter = express.Router();


ProtectedRouter.get("/profile", verifyUser, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.email).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    return res.json({ user: userDoc.data() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



export default ProtectedRouter;
