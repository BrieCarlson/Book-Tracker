const Book = require("../models/Book");

// Get all books
exports.getBooks = async (requestAnimationFrame, res) => {
    try {
        const books = await Book.find();

        res.json(books);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get one book
exports.getBook = async (requestAnimationFrame, res) => {
    try {
        const book = await Book.findById(requestAnimationFrame.params.id);
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Create a book
exports.createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(
            req.params.id
        );
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        res.json({
            message: "Book deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};