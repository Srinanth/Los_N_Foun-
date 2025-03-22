import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/UserControl.js";

const ProfileRouter = express.Router();

ProfileRouter.get("/profile/:userId", getUserProfile);
ProfileRouter.put("/update/:userId", updateUserProfile);

export default ProfileRouter;
