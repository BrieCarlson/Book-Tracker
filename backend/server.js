const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Book Tracker API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});