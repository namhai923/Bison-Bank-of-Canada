const express = require("express");
const User = require("../../models/user.model");
const { cache, setCacheExpire } = require("../../cache");

let router = express.Router();
const CACHE_EXPIRED_IN_SECONDS = 300;

router.post("/", async (req, res, next) => {
  // check if the username exist, if not then add user
  try {
    let { userName, firstName, lastName, accountBalance } = req.body;
    let user = await User.findOne({ userName: userName });
    if (user !== null) {
      res.status(400).send("User Already Exists.");
    } else {
      let newUser = new User({
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        accountBalance: accountBalance ?? 0,
      });
      user = await newUser.save();
      res.status(201).send(user);
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.get("/:name", async (req, res, next) => {
  // check if the username exist, then return user data
  try {
    let userName = req.params["name"];
    if (cache.has(userName)) {
      res.status(200).send(cache.get(userName));
    } else {
      // If not found in cache then go to database to search
      let user = await User.findOne({ userName: userName });

      if (user !== null) {
        // Set cache and set it to expired in 300 seconds
        cache.set(userName, user);
        setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
        res.status(200).send(user);
      } else {
        res.status(404).send("User Not Found.");
      }
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.post("/:name/transfer", async (req, res, next) => {
  try {
    var errorMessage = "";

    let senderName = req.params["name"];
    let { receiverName, amount } = req.body;

    if (receiverName == null || amount == null) {
      throw new Error("Missing require parameter in request body.");
    }
    let sender = await User.findOne({ userName: senderName });
    let receiver = await User.findOne({ userName: receiverName });

    if (receiver != null) {
      if (isNaN(amount)) {
        errorMessage += "Transfer failed: transfer amount must be a number.\n";
      } else {
        if (amount <= 0) {
          errorMessage +=
            "Transfer failed: transfer amount must be greater than 0.\n";
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

            let transferHistory = {
              sender: senderName,
              receiver: receiverName,
              date: Date.now(),
              amount: amount,
            };

            sender.transferHistory.push(transferHistory);
            receiver.transferHistory.push(transferHistory);

            await Promise.all([sender.save(), receiver.save()]);

            //Update cache
            if (cache.has(senderName)) {
              cache.set(senderName, sender);
            }
            if (cache.has(receiverName)) {
              cache.set(receiverName, receiver);
            }
          } else {
            errorMessage +=
              "Transfer failed: " +
              senderName +
              " account balance not enough\n";
          }
        }
      }
    } else {
      errorMessage += "Transfer failed: " + receiverName + " does not exists\n";
    }

    if (errorMessage === "") {
      res.status(200).send("Successfully processed transfer");
    } else {
      res.status(400).send(errorMessage);
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

module.exports = router;
