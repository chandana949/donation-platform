import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Donation Platform API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});