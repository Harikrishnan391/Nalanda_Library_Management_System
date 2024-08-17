import express from "express";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import userRoute from "./Routes/user.js";
import adminRoute from "./Routes/admin.js";
import authRouter from "./Routes/auth.js";
import reportRouter from "./Routes/reportRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("mongodb database connected");
  } catch (error) {
    console.log("mongodb databse  connnected is failed!");
  }
};

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/reports", reportRouter);

const server = app.listen(port, () => {
  try {
    connectDB();
    console.log("Server is running on port", port);
  } catch (error) {
    console.log(error);
  }
});
