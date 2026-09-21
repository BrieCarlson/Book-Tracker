const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const bookSearchRoutes = require("./routes/bookSearchRoutes");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 5000;
const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

connectDB();

app.disable("x-powered-by");

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));

app.use("/api/books", bookRoutes);
app.use("/api/book-search", bookSearchRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Book Tracker API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((error, req, res, next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "The book data is too large. Shorten the summary, notes, or cover image URL.",
    });
  }

  next(error);
});
