// const mongodb = require("../data/database");
// const ObjectId = require("mongodb").ObjectId;

// const getAll = async (req, res) => {
//   //#swagger.tags = ['Books']
//   try {
//     const result = await mongodb
//       .getDatabase()
//       .db()
//       .collection("books")
//       .find();
//     const books = await result.toArray();
//     res.setHeader("Content-Type", "application/json");
//     res.status(200).json(books);
//   } catch (err) {
//     console.error("Error fetching books:", err);
//     res.status(500).json({ message: "Failed to fetch books", error: err.message });
//   }
// };

// const getSingle = async (req, res) => {
//   //#swagger.tags = ['Books']
//   if (!ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: "Invalid book ID format." });
//   }
//   try {
//     const bookId = new ObjectId(req.params.id);
//     const result = await mongodb
//       .getDatabase()
//       .db()
//       .collection("books")
//       .find({ _id: bookId });
//     const books = await result.toArray();
//     if (books.length === 0) {
//       res.status(404).json({ message: "Book not found" });
//     } else {
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).json(books[0]);
//     }
//   } catch (err) {
//     console.error("Error fetching book:", err);
//     res.status(500).json({ message: "Failed to fetch book", error: err.message });
//   }
// };

// const createBook = async (req, res) => {
//   //#swagger.tags = ['Books']
//   try {
//     const book = {
//       title: req.body.title,
//       author: req.body.author,
//       genre: req.body.genre,
//       published_year: req.body.publishedYear,
//       ISBN: req.body.ISBN,
//       copies_available: req.body.copiesAvailable,
//       description: req.body.description
//     };

//     const response = await mongodb
//       .getDatabase()
//       .db()
//       .collection("books")
//       .insertOne(book);
//     if (response.acknowledged) {
//       res.status(201).json({ message: "Book created successfully", id: response.insertedId });
//     } else {
//       res.status(500).json({ message: "Failed to create book" });
//     }
//   } catch (err) {
//     console.error("Error creating book:", err);
//     res.status(500).json({ message: "Failed to create book", error: err.message });
//   }
// };

// const updateBook = async (req, res) => {
//   //#swagger.tags = ['Books']
//   if (!ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: "Invalid book ID format." });
//   }

//   try {
//     const bookId = new ObjectId(req.params.id);
//     const book = {
//       title: req.body.title,
//       author: req.body.author,
//       genre: req.body.genre,
//       published_year: req.body.publishedYear,
//       ISBN: req.body.ISBN,
//       copies_available: req.body.copiesAvailable,
//       description: req.body.description
//     };

//     const response = await mongodb
//       .getDatabase()
//       .db()
//       .collection("books")
//       .replaceOne({ _id: bookId }, book);
//     if (response.modifiedCount > 0) {
//       res.status(200).json({ message: "Book updated successfully" });
//     } else {
//       res.status(404).json({ message: "Book not found or no changes made" });
//     }
//   } catch (err) {
//     console.error("Error updating book:", err);
//     res.status(500).json({ message: "Failed to update book", error: err.message });
//   }
// };

// const deleteBook = async (req, res) => {
//   //#swagger.tags = ['Books']
//   if (!ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: "Invalid book ID format." });
//   }

//   try {
//     const bookId = new ObjectId(req.params.id);
//     const response = await mongodb
//       .getDatabase()
//       .db()
//       .collection("books")
//       .deleteOne({ _id: bookId });

//     if (response.deletedCount > 0) {
//       res.status(200).json({ message: "Book deleted successfully" });
//     } else {
//       res.status(404).json({ message: "Book not found" });
//     }
//   } catch (err) {
//     console.error("Error deleting book:", err);
//     res.status(500).json({ message: "Failed to delete book", error: err.message });
//   }
// };

// module.exports = {
//   getAll,
//   getSingle,
//   createBook,
//   updateBook,
//   deleteBook,
// };
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

const getAll = async (req, res) => {
  //#swagger.tags = ['Books']
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("books")
      .find();
    const books = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags = ['Books']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid book ID format." });
  }
  try {
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("books")
      .findOne({ _id: bookId }); // Use findOne instead of find().toArray()
    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ message: "Failed to fetch book", error: err.message });
  }
};

const createBook = async (req, res) => {
  //#swagger.tags = ['Books']
  try {
    const book = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      published_year: req.body.publishedYear,
      ISBN: req.body.ISBN,
      copies_available: req.body.copiesAvailable,
      description: req.body.description,
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("books")
      .insertOne(book);
    if (response.acknowledged) {
      res.status(201).json({ message: "Book created successfully", id: response.insertedId });
    } else {
      res.status(500).json({ message: "Failed to create book" });
    }
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(500).json({ message: "Failed to create book", error: err.message });
  }
};

const updateBook = async (req, res) => {
  //#swagger.tags = ['Books']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid book ID format." });
  }

  try {
    const bookId = new ObjectId(req.params.id);
    const book = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      published_year: req.body.publishedYear,
      ISBN: req.body.ISBN,
      copies_available: req.body.copiesAvailable,
      description: req.body.description,
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("books")
      .replaceOne({ _id: bookId }, book);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Book updated successfully" });
    } else {
      res.status(404).json({ message: "Book not found or no changes made" });
    }
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Failed to update book", error: err.message });
  }
};

const deleteBook = async (req, res) => {
  //#swagger.tags = ['Books']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid book ID format." });
  }

  try {
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("books")
      .deleteOne({ _id: bookId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Failed to delete book", error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook,
};
