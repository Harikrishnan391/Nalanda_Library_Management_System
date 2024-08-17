import express from "express";
import { authenticate } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getActiveMembers,
  getMostBorrowedBooks,
  getAvailableBook,
} from "../Controllers/reportController.js";

// Create an instance of the Express router for report-related routes
const reportRouter = express.Router();

// Apply middleware to authenticate the user and verify if they are an admin
reportRouter.use(authenticate, verifyAdmin("Admin"));

/**
 * @route GET /most-borrowed-books
 * @desc Retrieve a list of the most borrowed books
 * @access Private (Admin only)
 * @middleware authenticate - Verifies the JWT token
 * @middleware verifyAdmin - Checks if the user has 'Admin' role
 * @returns {Array} List of most borrowed books
 */
reportRouter.get("/most-borrowed-books", getMostBorrowedBooks);

/**
 * @route GET /active-members
 * @desc Retrieve a list of active members
 * @access Private (Admin only)
 * @middleware authenticate - Verifies the JWT token
 * @middleware verifyAdmin - Checks if the user has 'Admin' role
 * @returns {Array} List of active members
 */
reportRouter.get("/active-members", getActiveMembers);

/**
 * @route GET /getAvailableBooks
 * @desc Retrieve a list of available books
 * @access Private (Admin only)
 * @middleware authenticate - Verifies the JWT token
 * @middleware verifyAdmin - Checks if the user has 'Admin' role
 * @returns {Array} List of available books
 */
reportRouter.get("/getAvailableBooks", getAvailableBook);

export default reportRouter;
