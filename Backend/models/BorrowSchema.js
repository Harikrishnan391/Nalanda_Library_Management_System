import mongoose from "mongoose";

const BorrowSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrowedAt: {
    type: String,
    default: Date.now,
  },
  returnDate: {
    type: String,
  },
  returned: { type: Boolean, default: false },
});

const Borrow = mongoose.model("Borrow", BorrowSchema);
export default Borrow;
