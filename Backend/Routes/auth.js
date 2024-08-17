import express from "express";
import { register, login, logout } from "../Controllers/authController.js";

// Create an instance of the Express router for authentication-related routes
const authRouter = express.Router();

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 * @param {Object} req.body - User registration details (e.g., username, password)
 */
authRouter.post('/register', register);

/**
 * @route POST /login
 * @desc Authenticate a user and return a token
 * @access Public
 * @param {Object} req.body - User login credentials (e.g., username, password)
 */
authRouter.post('/login', login);

/**
 * @route POST /logout
 * @desc Log out the user by invalidating their session or token
 * @access Private
 * @middleware authenticate - Verifies the JWT token
 * @param {Object} req - Express request object
 */
authRouter.post('/logout', logout);

export default authRouter;
