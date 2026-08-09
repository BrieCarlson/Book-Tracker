const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");

router.get("/", protect, getBooks);
router.get("/:id", protect, getBook);
router.post("/", protect, createBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;