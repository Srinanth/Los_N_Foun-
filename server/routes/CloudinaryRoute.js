import express from "express";
import multer from "multer";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/CloudinaryConfig.js";

const Cloudrouter = express.Router();
const upload = multer();


Cloudrouter.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer); 
    res.json({ imageUrl: result.secure_url }); 
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
});

Cloudrouter.delete("/delete-image", async (req, res) => {
  const { publicId } = req.body;

  try {
    const result = await deleteFromCloudinary(publicId);
    res.json({ message: "Image deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Image deletion failed" });
  }
});

export default Cloudrouter;