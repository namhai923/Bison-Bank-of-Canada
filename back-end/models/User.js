import mongoose from "mongoose";

let expenseSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

let transferSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  amount: {
    type: Number,
    required: true,
  },
});

let userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    expenseHistory: {
      type: [expenseSchema],
      default: [],
    },
    transferHistory: {
      type: [transferSchema],
      default: [],
    },
  },
  { collection: "Users" }
);

export default mongoose.model("User", userSchema);
