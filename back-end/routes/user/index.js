import express from "express";
let router = express.Router();
import User from "../../models/User.js";
import cache from "../../cache.js";

router.post("/", async (req, res, next) => {
  // check if the username exist, then return user data
  try {
    let { userName, firstName, lastName } = req.body;
    let user = await User.findOne({ userName: userName });
    if (user !== null) {
      console.log(user);
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
      console.log(user);
      res.status(200).send(user);
    } else {
      res.status(404).send("User Not Found.");
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

export default router;
