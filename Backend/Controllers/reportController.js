import HttpStatusCodes from "../constants/http-status-code.js";
import Book from "../models/BookSchema.js";
import Borrow from "../models/BorrowSchema.js";

// Retrieves the most borrowed books
export const getMostBorrowedBooks = async (req, res) => {
  try {
    const mostBorrowedBooks = await Borrow.aggregate([
      // Group by bookId and count the number of borrows
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      // Sort by the borrow count in descending order
      { $sort: { count: -1 } },
      // Limit to top 10 most borrowed books
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

    return res.status(HttpStatusCodes.OK).json({
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
      // Group by userId and count the number of borrows
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      // Sort by the borrow count in descending order
      { $sort: { count: -1 } },
      // Limit to top 10 most active members
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

    console.log(activeMembers, "getActiveMembers");
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching active members",
    });
  }
};

// Retrieves the available books in the library
export const getAvailableBook = async (req, res) => {
  try {
    const [result] = await Book.aggregate([
      // Stage 1: Lookup borrowed books for each book
      {
        $lookup: {
          from: "borrows",
          localField: "_id",
          foreignField: "bookId",
          as: "borrowedBooks",
        },
      },
      // Calculate the number of currently borrowed copies
      {
        $addFields: {
          borrowedCount: {
            $size: {
              $filter: {
                input: "$borrowedBooks",
                as: "borrow",
                cond: { $eq: ["$$borrow.returned", false] },
              },
            },
          },
        },
      },
      // Stage 2: Group and calculate total copies, borrowed books, and available books
      {
        $group: {
          _id: null,
          totalBooks: { $sum: "$numberOfCopies" },
          totalBorrowedBooks: { $sum: "$borrowedCount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalBooks: 1,
          borrowedBooks: "$totalBorrowedBooks",
          availableBooks: { $subtract: ["$totalBooks", "$totalBorrowedBooks"] },
        },
      },
    ]);

    if (!result) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "No book availability data found",
      });
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching book availability",
    });
  }
};
