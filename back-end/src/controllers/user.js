const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache } = require("../cache");
const { validateUpdateInfo, validateSearchUser } = require("../validators");
const { getUser } = require("../utilities");

const getInfo = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { firstName, lastName, dob, phoneNumber, creditPoints } =
    userInfo.toJSON();
  return res
    .status(200)
    .json({ firstName, lastName, dob, phoneNumber, creditPoints });
});

const searchUser = asyncHandler(async (req, res) => {
  const { error, value } = validateSearchUser(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { searchQuery } = value;

  const findUsers = await User.find({
    userName: { $regex: searchQuery },
  }).select("userName");
  return res.status(200).json(findUsers);
});

const updateInfo = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateInfo(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { firstName, lastName, dob, phoneNumber } = value;
  let userName = req.user.userName;
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
});

module.exports = {
  getInfo,
  searchUser,
  updateInfo,
};
