const express = require("express");
const rateLimit = require("express-rate-limit");

const protect = require("../middleware/authMiddleware");
const {
    searchBooks,
} = require("../controllers/bookSearchController");

const router = express.Router();

const searchLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message:
            "Too many book searches. Please wait a moment.",
    },
});

router.get("/", protect, searchLimiter, searchBooks);

module.exports = router;
