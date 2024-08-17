import HttpStatusCodes from "../constants/http-status-code.js";
import Book from "../models/BookSchema.js";
import User from "../models/UserSchema.js";
import Borrow from "../models/BorrowSchema.js";
import moment from "moment";

// Handles listing books with optional filters and pagination
export const ListBooks = async (req, res) => {
  try {
    const { genre, author, page = 1, limit = 5 } = req.query;

    // Parse page and limit query parameters
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit values
    if (pageNumber <= 0 || limitNumber <= 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid page or limit value",
      });
    }

    // Build query object based on optional filters
    const query = {};
    if (genre) {
      query.genre = genre;
    }
    if (author) {
      query.author = author;
    }

    // Calculate pagination values
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch books with pagination
    const books = await Book.find(query).skip(skip).limit(limitNumber);
    const totalBooks = await Book.countDocuments(query);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: books,
      total: totalBooks,
      page: pageNumber,
      totalPages: Math.ceil(totalBooks / limitNumber),
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching books",
    });
  }
};

// Handles borrowing a book by its ISBN
export const BorrowBook = async (req, res) => {
  try {
    const { ISBN } = req.params;
    const userId = req.userId;

    // Validate input parameters
    if (!ISBN || !userId) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Book ISBN and user ID are required",
      });
    }

    // Find the book and user
    const book = await Book.findOne({ ISBN });
    const user = await User.findById(userId);

    if (!book) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Book not found",
      });
    }

    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if book has available copies
    if (book.numberOfCopies <= 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No available copies of the book",
      });
    }

    // Create a new borrow record
    const formattedBorrowDate = moment().format("D-M-YYYY");
    const borrowRecord = new Borrow({
      bookId: book._id,
      userId: user._id,
      borrowedAt: formattedBorrowDate,
    });

    await borrowRecord.save();

    // Update book's available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });
  } catch (error) {
    console.log(error.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while borrowing the book",
    });
  }
};

// Handles returning a borrowed book by its Borrow ID
export const ReturnBook = async (req, res) => {
  try {
    const { BorrowId } = req.params;
    const borrowRecord = await Borrow.findById(BorrowId);

    if (!borrowRecord) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    if (borrowRecord.returned) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Book already returned",
      });
    }

    // Update borrow record with return details
    const formattedReturnDate = moment().format("D-M-YYYY");
    borrowRecord.returned = true;
    borrowRecord.returnDate = formattedReturnDate;
    await borrowRecord.save();

    // Update book's available copies
    const book = await Book.findById(borrowRecord.bookId);

    if (!book) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Book not found",
      });
    }

    book.availableCopies += 1;
    await book.save();

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while returning the book",
    });
  }
};

// Retrieves the borrowing history of the authenticated user
export const GetBorrowHistory = async (req, res) => {
  try {
    const userId = req.userId;

    // Find borrow records for the user and populate book details
    const borrowRecords = await Borrow.find({ userId })
      .populate("bookId", "title author ISBN")
      .sort({ borrowedAt: -1 });

    if (borrowRecords.length === 0) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "No borrowing history found",
      });
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: borrowRecords,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching borrowing history",
    });
  }
};
