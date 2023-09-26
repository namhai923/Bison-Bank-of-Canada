const mongoose = require("mongoose");

const Decimal128 = mongoose.Decimal128;

// let expenseSchema = new mongoose.Schema({
//   location: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now(),
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Decimal128,
//     required: true,
//   },
// });

// let transferSchema = new mongoose.Schema({
//   sender: {
//     type: String,
//     required: true,
//   },
//   receiver: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now(),
//   },
//   amount: {
//     type: Decimal128,
//     required: true,
//   },
// });

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
    default: 0,
  },
  summary: {
    type: [summaryElementSchema],
    default: [],
  },
});

let favorSchema = new mongoose.Schema(
  {
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
    },
  },
  { timestamps: true }
);

let debtSchema = new mongoose.Schema(
  {
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
    // accountBalance: {
    //   type: Decimal128,
    //   default: 0,
    // },
    // expenseHistory: {
    //   type: [expenseSchema],
    //   default: [],
    // },
    // transferHistory: {
    //   type: [transferSchema],
    //   default: [],
    // },
    favorSummary: {
      type: summarySchema,
    },
    debtSummary: {
      type: summarySchema,
    },
    pendingFavors: {
      type: [favorSchema],
      default: [],
    },
    pendingDebts: {
      type: [debtSchema],
      default: [],
    },
    favorHistory: {
      type: [favorSchema],
      default: [],
    },
    debtHistory: {
      type: [debtSchema],
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
    },
  },
  { collection: "Users" }
);

// userSchema.set("toJSON", {
//   getters: true,
//   transform: (doc, ret) => {
//     if (ret.accountBalance) {
//       ret.accountBalance = parseFloat(ret.accountBalance);
//     }
//     return ret;
//   },
// });

// expenseSchema.set("toJSON", {
//   getters: true,
//   transform: (doc, ret) => {
//     if (ret.amount) {
//       ret.amount = parseFloat(ret.amount);
//     }
//     return ret;
//   },
// });

// transferSchema.set("toJSON", {
//   getters: true,
//   transform: (doc, ret) => {
//     if (ret.amount) {
//       ret.amount = parseFloat(ret.amount);
//     }
//     return ret;
//   },
// });

favorSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    return ret;
  },
});

debtSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    return ret;
  },
});

summaryElementSchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount);
    }
    return ret;
  },
});

summarySchema.set("toJSON", {
  getters: true,
  transform: (doc, ret) => {
    if (ret.total) {
      ret.total = parseFloat(ret.total);
    }
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
