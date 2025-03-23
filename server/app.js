import express from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/AuthRoutes.js";
import cors from "cors";
import ProtectedRouter from "./routes/ProtectedRoute.js";
import Cloudrouter from "./routes/CloudinaryRoute.js";
import Reportrouter from "./routes/ReportRoute.js";
import FoundRouter from "./routes/FoundRoute.js";
import Matchrouter from "./routes/MatchRoute.js";
import ProfileRouter from "./routes/UserRoute.js";
import NearbyRoute from "./controllers/nearby.js";
import MailRouter from "./routes/Mailroute.js";

dotenv.config();
const app = express();
app.use(cors({ origin: "https://los-n-found-p783.onrender.com", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", UserRouter);
app.use("/api/protected", ProtectedRouter);
app.use("/api/cloudinary", Cloudrouter);
app.use("/api", Reportrouter); 
app.use("/api", FoundRouter);
app.use("/api", Matchrouter);
app.use("/api",ProfileRouter);
app.use("/api",NearbyRoute);
app.use("/api",MailRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
