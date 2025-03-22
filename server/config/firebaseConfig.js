import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Parse Firebase credentials from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


export const db = admin.firestore();
export const auth = admin.auth();

console.log("🔥 Firebase connected successfully!");
