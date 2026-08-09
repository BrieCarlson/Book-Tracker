const Book = require("../models/Book");

// Get all books for logged-in user
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find({
            userId: req.user.id,
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get one book for logged-in user
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

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
        const book = await Book.create({
            ...req.body,
            userId: req.user.id,
        });

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
        const book = await Book.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
            },
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
        const book = await Book.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

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