import admin from "firebase-admin";

const db = admin.firestore();


export const getUserProfile = async (req, res) => {
    const { userId } = req.params;
  
    try {
      
      const reportedItemsSnap = await db.collection("reportedItems").where("userId", "==", userId).get();
      const foundItemsSnap = await db.collection("foundItems").where("userId", "==", userId).get();
  
      const userProfile = {
        reportsCount: reportedItemsSnap.size,
        foundCount: foundItemsSnap.size,
      };
  
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Error fetching user profile" });
    }
  };


export const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
  
    try {
      const userRef = db.collection("users").doc(userId);
      const userSnap = await userRef.get();
      if (!userSnap.exists) {
        await userRef.set(updateData);
      } else {
        await userRef.update(updateData);
      }
  
      res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Error updating profile" });
    }
  };
  
