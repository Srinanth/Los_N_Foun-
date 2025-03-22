import express from "express";
import { db, auth } from "../config/firebaseConfig.js"; 

const Reportrouter = express.Router();


Reportrouter.post("/report", async (req, res) => {
  const { category, description, location, imageUrl } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validate required fields
  if (!category || !description || !location || !location.lat || !location.lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify the user's ID token
    const user = await auth.verifyIdToken(token);
    const userId = user.uid;

    // Save report data to Firestore
    const reportData = {
      userId,
      category,
      description,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      imageUrl: imageUrl || null, // Optional field
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("reportedItems").add(reportData);
    res.status(201).json({ id: docRef.id, message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error saving report:", error.message || error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

export default Reportrouter;
