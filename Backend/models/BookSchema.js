import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    availableCopies: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);
export default Book;
