const mongoose = require("mongoose");
const uuid = require("uuid");

const Decimal128 = mongoose.Decimal128;

let summaryElementSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  amount: {
    type: Decimal128,
    default: 0,
  },
});

let summarySchema = new mongoose.Schema({
  total: {
    type: Decimal128,
    required: true,
  },
  summary: {
    type: [summaryElementSchema],
    required: true,
  },
});

let favorSchema = new mongoose.Schema(
  {
    favorId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    amount: {
      type: Decimal128,
      required: true,
    },
    description: {
      type: String,
      maxlength: 100,
    },
    accepted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

let repaySchema = new mongoose.Schema(
  {
    repayId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    amount: {
      type: Decimal128,
      required: true,
    },
    description: {
      type: String,
      maxlength: 100,
    },
    accepted: {
      type: Boolean,
    },
    send: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

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

let pokeSchema = new mongoose.Schema({
  pokemon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pokemon",
  },
});

let notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      default: uuid.v4,
    },
    userName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

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
    creditPoints: {
      type: Number,
      default: 100,
    },
    favorSummary: {
      type: summarySchema,
      default: { total: 0, summary: [] },
    },
    debtSummary: {
      type: summarySchema,
      default: { total: 0, summary: [] },
    },
    pendingFavor: {
      type: [favorSchema],
      default: [],
    },
    pendingRepay: {
      type: [repaySchema],
      default: [],
    },
    favorHistory: {
      type: [favorSchema],
      default: [],
    },
    debtHistory: {
      type: [favorSchema],
      default: [],
    },
    repayHistory: {
      type: [repaySchema],
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
    notificationList: {
      type: [notificationSchema],
      default: [],
    },
    pokeCollection: {
      type: [pokeSchema],
      default: [],
    },
  },
  { collection: "Users" }
);

favorSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    delete ret._id;
    return ret;
  },
});

repaySchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    delete ret._id;
    return ret;
  },
});

summaryElementSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    delete ret._id;
    return ret;
  },
});

summarySchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.total) {
      ret.total = parseFloat(ret.total);
    }
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
