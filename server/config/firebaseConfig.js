import admin from "firebase-admin";
import { readFile } from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
  await readFile(new URL(process.env.FIREBASE_SERVICE_ACCOUNT, import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();
console.log("🔥 Firebase connected successfully!");
