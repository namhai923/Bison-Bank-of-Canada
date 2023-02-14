import express from "express";
let router = express.Router();
import User from "../../models/User.js";
import cache from "../../cache.js";

router.post("/", async (req, res, next) => {
  // check if the username exist, if not then add user
  try {
    let { userName, firstName, lastName } = req.body;
    let user = await User.findOne({ userName: userName });
    if (user !== null) {
      console.log(user.toJSON());
      res.status(400).send("User Already Exists.");
    } else {
      let newUser = new User({
        userName: userName,
        firstName: firstName,
        lastName: lastName,
      });
      user = await newUser.save();
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.get("/:name", async (req, res, next) => {
  // check if the username exist, then return user data
  console.log(cache);
  try {
    let userName = req.params['name'];
    let user = await User.findOne({ userName: userName });
    cache.set(userName, user);
    if (user !== null) {
      console.log(user.toJSON());
      res.status(200).send(user);
    } else {
      res.status(404).send("User Not Found.");
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.post("/:name/transfer", async (req, res, next) => {
  try{
    var errorMessage = "";

    let senderName = req.params['name'];
    let {receiverName, amount} = req.body;
    let sender = await User.findOne({ userName: senderName });
    let receiver = await User.findOne({ userName : receiverName });

    if(receiver != null){
      if(sender.accountBalance >= amount){
        sender.accountBalance = Math.round(parseFloat(sender.accountBalance*100) -  amount*100) / 100;
        receiver.accountBalance = Math.round(parseFloat(receiver.accountBalance*100) + amount*100) / 100;

        let transferHistory = {
          sender: senderName,
          receiver: receiverName,
          date: Date.now(),
          amount: amount
        }

        sender.transferHistory.push(transferHistory);
        receiver.transferHistory.push(transferHistory)
        
        await Promise.all([sender.save(), receiver.save()]);

      }else{
        errorMessage += "Transfer failed: " + senderName + " account balance not enough\n";
      }
    }else{
      errorMessage += "Transfer failed: " + receiverName + " does not exists\n";
    }


  } catch (err){
    res.status(500).json({ ErrorMessage: err.message });
  }

  if (errorMessage === "") {
    res.status(200).send("Successfully processed transfer");
  } else {
    res.status(400).send("Errors:\n" + errorMessage);
  }
});

export default router;
