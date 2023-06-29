const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache, setCacheExpire } = require("../cache");
const { CACHE_EXPIRED_IN_SECONDS } = require("../config/vars.config");

const checkParams = (obj, params) => {
  return params.every((param) => Object.keys(obj).includes(param));
};

const getInfo = asyncHandler(async (req, res) => {
  if (!checkParams(req.body, ["userName"])) {
    return res
      .status(400)
      .json({ message: "Missing require parameter in request body." });
  }

  // check if the username exist, then return user data
  let { userName } = req.body;
  if (userName === req.user.userName) {
    if (cache.has(userName)) {
      return res.status(200).json(cache.get(userName));
    } else {
      // If not found in cache then go to database to search
      let user = await User.findOne({ userName });

      // Set cache and set it to expired in 300 seconds
      cache.set(userName, user);
      setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
      return res.status(200).json(user);
    }
  } else {
    return res.status(401).json({
      message: "You are not allowed to see this account information.",
    });
  }
});

const updateInfo = asyncHandler(async (req, res) => {
  if (
    !checkParams(req.body, [
      "userName",
      "firstName",
      "lastName",
      "dob",
      "phoneNumber",
    ])
  ) {
    return res
      .status(400)
      .json({ message: "Missing require parameter in request body." });
  }

  let { userName, firstName, lastName, dob, phoneNumber } = req.body;
  if (userName === req.user.userName) {
    let user = await User.findOne({ userName });
    let updateProfile;

    user.firstName = firstName;
    user.lastName = lastName;
    user.dob = dob;
    user.phoneNumber = phoneNumber;

    updateProfile = await user.save();

    if (cache.has(userName)) {
      cache.set(userName, user);
    }

    return res.status(200).json(updateProfile);
  } else {
    return res
      .status(401)
      .json({ message: "You are not allowed to edit this profile" });
  }
});

const transfer = asyncHandler(async (req, res) => {
  if (!checkParams(req.body, ["userName", "receiverName", "amount"])) {
    return res
      .status(400)
      .json({ message: "Missing require parameter in request body." });
  }

  let { userName: senderName, receiverName, amount } = req.body;
  if (senderName === req.user.userName) {
    let errorMessage = "";
    let sender = await User.findOne({ userName: senderName });
    let receiver = await User.findOne({ userName: receiverName });
    let newTransfer;
    if (receiver != null) {
      if (isNaN(amount) && isNaN(parseFloat(amount))) {
        errorMessage = "Transfer amount must be a number.";
      } else {
        if (amount <= 0) {
          errorMessage = "Transfer amount must be greater than 0.";
        } else {
          if (sender.accountBalance >= amount) {
            sender.accountBalance =
              Math.round(
                parseFloat(sender.accountBalance * 100) - amount * 100
              ) / 100;
            receiver.accountBalance =
              Math.round(
                parseFloat(receiver.accountBalance * 100) + amount * 100
              ) / 100;

            newTransfer = {
              sender: senderName,
              receiver: receiverName,
              date: Date.now(),
              amount: amount,
            };

            sender.transferHistory.push(newTransfer);
            receiver.transferHistory.push(newTransfer);

            await Promise.all([sender.save(), receiver.save()]);

            //Update cache
            cache.set(senderName, sender);
            cache.set(receiverName, receiver);
          } else {
            errorMessage = "Account balance not enough.";
          }
        }
      }
    } else {
      errorMessage = "Receiver does not exists.";
    }

    if (errorMessage === "") {
      return res.status(200).json(newTransfer);
    } else {
      return res.status(400).json({ message: errorMessage });
    }
  } else {
    return res.status(401).json({
      message: "You are not allowed to send money from this account",
    });
  }
});

const expense = asyncHandler(async (req, res) => {
  if (!checkParams(req.body, ["userName", "location", "category", "amount"])) {
    return res
      .status(400)
      .json({ message: "Missing require parameter in request body." });
  }

  let { userName, location, category, amount } = req.body;
  if (userName === req.user.userName) {
    let errorMessage = "";

    let user = await User.findOne({ userName });
    let newExpense;

    if (isNaN(amount)) {
      errorMessage = "Expense amount must be a number.";
    } else {
      if (amount <= 0) {
        errorMessage = "Expense amount must be greater than 0.";
      } else {
        if (user.accountBalance >= amount) {
          user.accountBalance =
            Math.round(parseFloat(user.accountBalance * 100) - amount * 100) /
            100;

          newExpense = {
            location,
            category,
            amount,
            date: Date.now(),
          };

          user.expenseHistory.push(newExpense);

          await user.save();

          //Update cache`
          if (cache.has(userName)) {
            cache.set(userName, user);
          }
        } else {
          errorMessage = "Account balance not enough.";
        }
      }
    }

    if (errorMessage === "") {
      return res.status(200).json(newExpense);
    } else {
      return res.status(400).json({ message: errorMessage });
    }
  } else {
    return res.status(401).json({
      message: "You are not allowed to send money from this account",
    });
  }
});

module.exports = { getInfo, updateInfo, transfer, expense };
