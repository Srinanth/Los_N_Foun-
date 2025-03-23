import express from "express";
import admin from "firebase-admin";

const NearbyRoute = express.Router();


function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const R = 6371; 
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


async function getAllItems() {
  const reportedItemsRef = admin.firestore().collection("reportedItems");
  const foundItemsRef = admin.firestore().collection("foundItems");

  const reportedItemsSnapshot = await reportedItemsRef.get();
  const foundItemsSnapshot = await foundItemsRef.get();

  const reportedItems = reportedItemsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    type: "reported", 
  }));

  const foundItems = foundItemsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    type: "found", 
  }));

  return [...reportedItems, ...foundItems]; // Combine both arrays
}

// Filter items based on selected location
NearbyRoute.get("/items", async (req, res) => {
  const { latitude, longitude, radius = 20 } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const allItems = await getAllItems();
    const center = [parseFloat(latitude), parseFloat(longitude)];
    const radiusInKm = parseFloat(radius);

    // Filter items within the specified radius
    const filteredItems = allItems.filter((item) => {
      if (!item.location || !item.location.lat || !item.location.lng) return false;

      const distance = haversineDistance(
        center[0],
        center[1],
        item.location.lat,
        item.location.lng
      );

      return distance <= radiusInKm;
    });

    
    res.json({ items: filteredItems });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

export default NearbyRoute;