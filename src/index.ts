import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import verificationRoutes from "./routes/verificationRoutes";
import requestRoutes from "./routes/requestRoutes";
import matchRoutes from "./routes/matchRoutes";
import contactRoutes from "./routes/contactRoutes";
import statsRoutes from "./routes/statsRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("BloodBridge API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});