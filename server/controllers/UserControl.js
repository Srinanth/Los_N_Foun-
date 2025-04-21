import admin from "firebase-admin";

const db = admin.firestore();
const auth = admin.auth();

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data() || {};

    const reportedItemsSnap = await db.collection("reportedItems").where("userId", "==", userId).get();
    const foundItemsSnap = await db.collection("foundItems").where("userId", "==", userId).get();

    const userProfile = {
      ...userData,
      reportsCount: reportedItemsSnap.size,
      foundCount: foundItemsSnap.size,
      userId: userId,
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone, profileImage } = req.body;

  const updateData = {
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(profileImage && { profileImage }),
  };

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create document if it doesn't exist
      await userRef.set(updateData);
    } else {
      // Update only the fields provided
      await userRef.update(updateData);
    }

    res.json({ success: true, message: "Profile saved successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error saving profile" });
  }
};
