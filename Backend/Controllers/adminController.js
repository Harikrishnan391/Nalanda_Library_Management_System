import HttpStatusCodes from "../constants/http-status-code.js";
import Book from "../models/BookSchema.js";
import Borrow from "../models/BorrowSchema.js";

// Adds a new book to the database
export const addBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, numberOfCopies } =
    req.body;

  try {
    // Check if the book already exists
    let existingBook = await Book.findOne({ ISBN: ISBN });

    if (existingBook) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        failed: true,
        message: "Book already exists",
      });
    }

    // Create a new book entry
    const newBook = await Book.create({
      title,
      author,
      ISBN,
      publicationDate,
      genre,
      numberOfCopies,
      availableCopies: numberOfCopies,
    });

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while adding the book",
    });
  }
};

// Updates details of an existing book
export const updateBookDetails = async (req, res) => {
  try {
    const { ISBN } = req.query;
    const updates = req.body;

    // Validate input parameters
    if (!ISBN || !updates) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "ISBN and updates are required",
      });
    }

    // Update book details based on ISBN
    let updatedBook = await Book.findOneAndUpdate({ ISBN }, updates, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "Book not found",
      });
    }

    res.status(HttpStatusCodes.OK).json({
      status: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
};

// Deletes a book from the database
export const deleteBook = async (req, res) => {
  try {
    const { ISBN } = req.query;

    // Validate ISBN parameter
    if (!ISBN) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ISBN query parameter is required",
      });
    }

    // Delete the book based on ISBN
    const deletedBook = await Book.findOneAndDelete({ ISBN });

    if (!deletedBook) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while deleting the book",
    });
  }
};

// Retrieves the most borrowed books
export const getMostBorrowedBooks = async (req, res) => {
  try {
    const mostBorrowedBooks = await Borrow.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          count: 1,
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          ISBN: "$bookDetails.ISBN",
        },
      },
    ]);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: mostBorrowedBooks,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching the most borrowed books",
    });
  }
};

// Retrieves the most active members based on borrowing activity
export const getActiveMembers = async (req, res) => {
  try {
    const activeMembers = await Borrow.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          count: 1,
          name: "$userDetails.name",
          email: "$userDetails.email",
        },
      },
    ]);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: activeMembers,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching active members",
    });
  }
};
