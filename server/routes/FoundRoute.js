import express from "express";
import { db, auth } from "../config/firebaseConfig.js";

const FoundRouter = express.Router();


FoundRouter.post("/found", async (req, res) => {
  const { category, description, location, imageUrl } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!category || !description || !location || !location.lat || !location.lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    
    const user = await auth.verifyIdToken(token);
    const userId = user.uid;

    const foundData = {
      userId,
      category,
      description,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      imageUrl: imageUrl || null, 
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("foundItems").add(foundData);
    res.status(201).json({ id: docRef.id, message: "Found item reported successfully" });
  } catch (error) {
    console.error("Error saving found report:", error.message || error);
    res.status(500).json({ error: "Failed to submit found item report" });
  }
});

export default FoundRouter;
