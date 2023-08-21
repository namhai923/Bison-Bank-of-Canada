const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache, setCacheExpire } = require("../cache");
const { CACHE_EXPIRED_IN_SECONDS } = require("../config/vars.config");
const {
  validateUserName,
  validateExpense,
  validateTransfer,
  validateProfile,
} = require("../validators");

const getInfo = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  // check if the username exist, then return user data
  let userName = value.userName;
  if (userName === req.user.userName) {
    let userInfo;
    if (cache.has(userName)) {
      userInfo = cache.get(userName);
    } else {
      // If not found in cache then go to database to search
      userInfo = await User.findOne({ userName });

      // Set cache and set it to expired in 300 seconds
      cache.set(userName, userInfo);
      setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
    }
    let { firstName, lastName, dob, phoneNumber } = userInfo.toJSON();
    return res.status(200).json({ firstName, lastName, dob, phoneNumber });
  } else {
    return res.status(401).json({
      message: "You are not allowed to see this account information.",
    });
  }
});

const getBalance = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  // check if the username exist, then return user data
  let userName = value.userName;
  if (userName === req.user.userName) {
    let userInfo;
    if (cache.has(userName)) {
      userInfo = cache.get(userName);
    } else {
      // If not found in cache then go to database to search
      userInfo = await User.findOne({ userName });

      // Set cache and set it to expired in 300 seconds
      cache.set(userName, userInfo);
      setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
    }
    let { accountBalance } = userInfo.toJSON();
    return res.status(200).json(accountBalance);
  } else {
    return res.status(401).json({
      message: "You are not allowed to see this account information.",
    });
  }
});

const getExpense = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  // check if the username exist, then return user data
  let userName = value.userName;
  if (userName === req.user.userName) {
    let userInfo;
    if (cache.has(userName)) {
      userInfo = cache.get(userName);
    } else {
      // If not found in cache then go to database to search
      userInfo = await User.findOne({ userName });

      // Set cache and set it to expired in 300 seconds
      cache.set(userName, userInfo);
      setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
    }
    let { expenseHistory } = userInfo.toJSON();
    return res.status(200).json(expenseHistory);
  } else {
    return res.status(401).json({
      message: "You are not allowed to see this account information.",
    });
  }
});

const getTransfer = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  // check if the username exist, then return user data
  let userName = value.userName;
  if (userName === req.user.userName) {
    let userInfo;
    if (cache.has(userName)) {
      userInfo = cache.get(userName);
    } else {
      // If not found in cache then go to database to search
      userInfo = await User.findOne({ userName });

      // Set cache and set it to expired in 300 seconds
      cache.set(userName, userInfo);
      setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
    }
    let { transferHistory } = userInfo.toJSON();
    return res.status(200).json(transferHistory);
  } else {
    return res.status(401).json({
      message: "You are not allowed to see this account information.",
    });
  }
});

const updateInfo = asyncHandler(async (req, res) => {
  const { error: queryError, value: queryValue } = validateUserName(req.query);

  if (queryError) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: queryError.details });
  }

  const { error: bodyError, value: bodyValue } = validateProfile(req.body);

  if (bodyError) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: bodyError.details });
  }

  let { firstName, lastName, dob, phoneNumber } = bodyValue;
  let userName = queryValue.userName;
  if (userName === req.user.userName) {
    let user = await User.findOne({ userName });

    user.firstName = firstName;
    user.lastName = lastName;
    user.dob = dob;
    user.phoneNumber = phoneNumber;

    await user.save();

    if (cache.has(userName)) {
      cache.set(userName, user);
    }

    return res.status(200).json("Information updated!");
  } else {
    return res
      .status(401)
      .json({ message: "You are not allowed to edit this profile" });
  }
});

const expense = asyncHandler(async (req, res) => {
  const { error: queryError, value: queryValue } = validateUserName(req.query);

  if (queryError) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: queryError.details });
  }

  const { error: bodyError, value: bodyValue } = validateExpense(req.body);

  if (bodyError) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: bodyError.details });
  }

  let { location, category, amount } = bodyValue;
  let userName = queryValue.userName;
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
      return res.status(200).json("Expense successfully!");
    } else {
      return res.status(400).json({ message: errorMessage });
    }
  } else {
    return res.status(401).json({
      message: "You are not allowed to send money from this account",
    });
  }
});

const transfer = asyncHandler(async (req, res) => {
  const { error: queryError, value: queryValue } = validateUserName(req.query);

  if (queryError) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: queryError.details });
  }

  const { error: bodyError, value: bodyValue } = validateTransfer(req.body);

  if (bodyError) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: bodyError.details });
  }

  let { receiverName, amount } = bodyValue;
  let senderName = queryValue.userName;
  if (senderName === req.user.userName) {
    let errorMessage = "";
    if (senderName === receiverName) {
      errorMessage = "Cannot transfer to yourself!";
    } else {
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
    }

    if (errorMessage === "") {
      return res.status(200).json("Transfer successfully!");
    } else {
      return res.status(400).json({ message: errorMessage });
    }
  } else {
    return res.status(401).json({
      message: "You are not allowed to send money from this account",
    });
  }
});

module.exports = {
  getInfo,
  getBalance,
  getExpense,
  getTransfer,
  updateInfo,
  expense,
  transfer,
};
