import User from "../models/UserSchema.js";
import { GeneratePassword, GenerateSalt } from "../util/index.js";
import bcrypt from "bcryptjs";
import generateToken from "../jwt/generateToken.js";

import HttpStatusCodes from "../constants/http-status-code.js";

// Handles user registration
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate salt and hash the password
    let salt = await GenerateSalt(10);
    let userpassword = await GeneratePassword(password, salt);

    // Create and save the new user
    const user = new User({
      name,
      email,
      password: userpassword,
      role,
    });

    await user.save();

    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: "User registered successfully" });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      failed: true,
      message: "Internal server error. Please try again.",
    });
  }
};

// Handles user login and token generation
export const login = async (req, res) => {
  let token;

  try {
    const { email, password, role } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Invalid user" });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Invalid email or password" });
    }

    // Generate token
    token = generateToken(user._id, role, res);

    res.status(HttpStatusCodes.OK).json({
      status: true,
      message: "Login Successful",
      token,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ failed: true, message: "Internal server error" });
  }
};

// Handles user logout by clearing the token cookie
export const logout = (req, res) => {
  try {
    // Clear the cookie by setting it with an expired date
    res.cookie("jwtuser", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 0,
    });

    res.status(HttpStatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Logout failed" });
  }
};


export const TestRequest=async()=>{

       
}