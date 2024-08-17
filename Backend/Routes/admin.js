import express from "express";
import { authenticate } from "../middleware/verifyToken.js";
import {
  addBook,
  updateBookDetails,
  deleteBook,
} from "../Controllers/adminController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

// Create an instance of the Express router for admin-related routes
const adminRouter = express.Router();

/**
 * @route POST /addBook
 * @desc Add a new book to the system
 * @access Private (Admin only)
 * @middleware authenticate - Verifies the JWT token
 * @middleware verifyAdmin - Checks if the user has 'Admin' role
 * @param {Object} req.body - Book details to be added
 */
adminRouter.post("/addBook", authenticate, verifyAdmin("Admin"), addBook);

/**
 * @route PUT /updateBook
 * @desc Update details of an existing book
 * @access Private (Admin only)
 * @middleware authenticate - Verifies the JWT token
 * @middleware verifyAdmin - Checks if the user has 'Admin' role
 * @param {Object} req.body - Updated book details
 */
adminRouter.put("/updateBook", authenticate, verifyAdmin("Admin"), updateBookDetails);

/**
 * @route DELETE /deleteBook
 * @desc Remove a book from the system
 * @access Private (Admin only)
 * @middleware authenticate - Verifies the JWT token
 * @middleware verifyAdmin - Checks if the user has 'Admin' role
 * @param {Object} req.body - Book identifier to be deleted
 */
adminRouter.delete("/deleteBook", authenticate, verifyAdmin("Admin"), deleteBook);

export default adminRouter;
