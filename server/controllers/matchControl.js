import admin from "firebase-admin";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const db = admin.firestore();

// Hugging Face API
const HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
const HF_API_KEY = process.env.HF_API_KEY;

// Fetch lost items by logged-in user
async function getUserLostItems(userId) {
  const lostRef = db.collection("reportedItems").where("userId", "==", userId);
  const lostDocs = await lostRef.get();
  return lostDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch all found items
async function getAllFoundItems() {
  const foundRef = db.collection("foundItems");
  const foundDocs = await foundRef.get();
  return foundDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get similarity score using Hugging Face API
async function getSimilarity(sentence1, sentence2) {
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: { source_sentence: sentence1, sentences: [sentence2] } },
      { headers: { Authorization: `Bearer ${HF_API_KEY}`, "Content-Type": "application/json" } }
    );

    return Array.isArray(response.data) ? response.data[0] : null;
  } catch (error) {
    return null;
  }
}

// Haversine formula to calculate distance between two coordinates
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Match user's lost items with all found items
async function matchUserItems(userId) {
  const lostItems = await getUserLostItems(userId);
  const foundItems = await getAllFoundItems();

  let matchedResults = [];

  for (const lost of lostItems) {
    let matches = [];

    for (const found of foundItems) {
      if (!lost.description || !found.description || !lost.location || !found.location) continue;

      // Calculate description similarity
      const similarity = await getSimilarity(lost.description, found.description);
      if (similarity === null || similarity < 0.5) continue;
      // Calculate distance between lost and found items
      const distance = haversineDistance(
        lost.location.lat,
        lost.location.lng,
        found.location.lat,
        found.location.lng
      );

      // Skip if distance is greater than 1km
      if (distance > 1) continue;

      // Normalize distance to a score between 0 and 1
      const normalizedDistance = distance / 1; // Since max distance is 1km

      // Calculate final score (weighted average of similarity and proximity)
      const finalScore = (0.7 * similarity) + (0.3 * (1 - normalizedDistance));

      matches.push({ foundItem: found, similarity: finalScore });
    }

    // Sort matches by final score and take top 3
    matches.sort((a, b) => b.similarity - a.similarity);
    matchedResults.push({ lostItem: lost, topMatches: matches.slice(0, 3) });
  }

  return matchedResults;
}

export { matchUserItems };