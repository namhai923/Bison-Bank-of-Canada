import mongoose from "mongoose";
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
  },
  { collection: "Users" }
);

userSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) =>{
    if(ret.accountBalance){
      ret.accountBalance = parseFloat(ret.accountBalance);
    }
    delete ret.__v;
    delete ret._id;
    delete ret.id;
    return ret;
  }
});

expenseSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) =>{
    if(ret.amount){
      ret.amount = parseFloat(ret.amount);
    }
    delete ret._id;
    delete ret.id;
    return ret;
  }
});

transferSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) =>{
    if(ret.amount){
      ret.amount = parseFloat(ret.amount);
    }
    delete ret._id;
    delete ret.id;
    return ret;
  }
});

export default mongoose.model("User", userSchema);
