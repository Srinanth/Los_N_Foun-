import { auth } from "../config/firebaseConfig.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(403).json({ message: "Unauthorized" });
  }
};
