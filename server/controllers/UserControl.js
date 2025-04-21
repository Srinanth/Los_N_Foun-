import admin from "firebase-admin";

const db = admin.firestore();
const auth = admin.auth();

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const authUser = await auth.getUser(userId);
    const reportedItemsSnap = await db.collection("reportedItems").where("userId", "==", userId).get();
    const foundItemsSnap = await db.collection("foundItems").where("userId", "==", userId).get();

    const userProfile = {
      name: userData.name || "",
      email: authUser.email || "",
      phone: userData.phone || "",
      profileImage: userData.profileImage || "",
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
  const { name, phone, profileImage, email } = req.body;

  try {

    const userRef = db.collection("users").doc(userId);
    await userRef.set({
      name,
      phone,
      profileImage,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    if (email) {
      const authUser = await auth.getUser(userId);
      if (authUser.email !== email) {
        await auth.updateUser(userId, { email });
      }
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      data: {
        name,
        phone,
        profileImage,
        email: email || undefined
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    
    let errorMessage = "Error updating profile";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Email is already in use by another account";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email address";
    }

    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
};