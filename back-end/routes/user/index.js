import express from "express";
let router = express.Router();
import User from "../../models/User.js";

router.post("/", async (req, res, next) => {
  // check if the username exist, then return user data
  try {
    let { username, firstName, lastName } = req.body;
    let user = await User.findOne({ username: username });
    if (user !== null) {
      console.log(user);
      res.status(200).send(user);
    } else {
      let newUser = new User({
        username: username,
        firstname: firstName,
        lastname: lastName,
      });
      user = await newUser.save();
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
  // else create a new user
});

export default router;
