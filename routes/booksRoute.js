const express = require("express");
const { Book } = require("../models/bookModel.js");
const checkToken = require("../config/checkToken.js");
const ensureLoggedIn = require("../config/ensureLoggedIn.js");

const router = express.Router();

// Route for Save a new Book
router.post("/", checkToken, ensureLoggedIn, async (request, response) => {
  try {
    console.log(request.body);
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
      userId: request.user._id,
    };

    const book = await Book.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Books from database
router.get("/", async (request, response) => {
  console.log("banna");
  try {
    const books = await Book.find({}).populate("userId");
    console.log("Books retrieved:", books);
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log("Error fetching books:", error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Book from database by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id).populate("userId");

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Book
router.put("/:id", checkToken, ensureLoggedIn, async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const { id } = request.params;

    const book = await Book.findById(id);

    if (!book) {
      return response.status(404).json({ message: "Book not found" });
    }
    if (book.userId.toString() !== request.user._id.toString()) {
      return response
        .status(401)
        .json({ message: "You are not authorized to update this book" });
    }

    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete("/:id", checkToken, ensureLoggedIn, async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);

    if (!book) {
      return response.status(404).json({ message: "Book not found" });
    }

    if (book.userId.toString() !== request.user._id.toString()) {
      return response
        .status(401)
        .json({ message: "You are not authorized to delete this book" });
    }

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

module.exports = router;
