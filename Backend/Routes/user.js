import express from "express";
import {
  BorrowBook,
  ListBooks,
  ReturnBook,
  GetBorrowHistory,
} from "../Controllers/userController.js";
import { authenticate } from "../middleware/verifyToken.js";

// Create an instance of the Express router for user-related routes
const userRouter = express.Router();

/**
 * @route GET /listBook
 * @desc Retrieve a list of all books
 * @access Public
 * @param {Object} req - Express request object
 * @returns {Array} - List of books
 */
userRouter.get("/listBook", ListBooks);

/**
 * @route POST /borrowBook/:ISBN
 * @desc Borrow a book by its ISBN
 * @access Private
 * @middleware authenticate - Verifies the JWT token
 * @param {string} req.params.ISBN - The ISBN of the book to borrow
 * @returns {Object} - Details of the borrowed book
 */
userRouter.post("/borrowBook/:ISBN", authenticate, BorrowBook);

/**
 * @route POST /returnBook/:BorrowId
 * @desc Return a borrowed book by its Borrow ID
 * @access Private
 * @middleware authenticate - Verifies the JWT token
 * @param {string} req.params.BorrowId - The ID of the borrowed book to return
 * @returns {Object} - Details of the returned book
 */
userRouter.post("/returnBook/:BorrowId", authenticate, ReturnBook);

/**
 * @route GET /borrowHistory
 * @desc Retrieve the borrowing history of the authenticated user
 * @access Private
 * @middleware authenticate - Verifies the JWT token
 * @returns {Array} - List of borrowed books and their details
 */
userRouter.get("/borrowHistory", authenticate, GetBorrowHistory);

export default userRouter;
