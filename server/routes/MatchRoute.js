import express from "express";
import { matchUserItems } from "../controllers/matchControl.js"; 

const Matchrouter = express.Router();

Matchrouter.get("/matches/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const matches = await matchUserItems(userId);
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

export default Matchrouter