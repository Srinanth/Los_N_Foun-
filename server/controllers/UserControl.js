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

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    const updateData = {
      name: name || null,
      phone: phone || null,
      profileImage: profileImage || null,
    };

    
    if (email && userSnap.data()?.email !== email) {
      await auth.updateUser(userId, { email });
      updateData.email = email; 
    }

    if (!userSnap.exists) {
      await userRef.set(updateData);
    } else {
      await userRef.update(updateData);
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({ error: "Email address is already in use." });
    }
    res.status(500).json({ error: "Error updating profile" });
  }
};