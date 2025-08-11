import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  res.send("Hello from Hospital Management System backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
