const mongoose = require("mongoose");

const Decimal128 = mongoose.Decimal128;

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
    type: Decimal128,
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
    type: Decimal128,
    required: true,
  },
});

let message = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sending: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

let conversation = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  latestMessage: {
    type: message,
  },
  unRead: {
    type: Number,
    default: 0,
    required: true,
  },
  messages: {
    type: [message],
    default: [],
  },
});

let contactSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
});

let userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    phoneNumber: {
      type: String,
    },
    accountBalance: {
      type: Decimal128,
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
    contacts: {
      type: [contactSchema],
      default: [],
    },
    conversationHistory: {
      type: [conversation],
      default: [],
    },
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { collection: "Users" }
);

userSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.accountBalance) {
      ret.accountBalance = parseFloat(ret.accountBalance);
    }
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

expenseSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    delete ret._id;
    return ret;
  },
});

transferSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    delete ret._id;
    return ret;
  },
});

contactSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
