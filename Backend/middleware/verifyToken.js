import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import HttpStatusCodes from "../constants/http-status-code.js";

export const authenticate = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ message: "Token not provided. Please log in to access this resource" });
    }

    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET_KEY);

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.log(error);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
