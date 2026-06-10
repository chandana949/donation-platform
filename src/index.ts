import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Donation Platform API Running");
});

app.use("/api/auth", authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});