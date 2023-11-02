const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache } = require("../cache");
const { validateUUID } = require("../validators");
const { getUser } = require("../utilities");

const getNotificationList = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { notificationList } = userInfo.toJSON();
  return res.status(200).json(notificationList);
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { error, value } = validateUUID(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { id: notificationId } = value;

  let userName = req.user.userName;
  let user = await User.findOne({ userName });
  user.notificationList = user.notificationList.filter(
    (notification) => notification.notificationId !== notificationId
  );

  await user.save();

  if (cache.has(userName)) {
    cache.set(userName, user);
  }
  return res.status(200).json("Notification deleted!");
});

const markReadNotification = asyncHandler(async (req, res) => {
  let { id } = req.query;
  let userName = req.user.userName;
  let user = await User.findOne({ userName });
  if (id === "all") {
    user.notificationList.forEach((notification) => {
      notification.read = true;
    });
  } else {
    const { error, value } = validateUUID(req.query);

    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid request.", details: error.details });
    }

    let { id: notificationId } = value;
    let notification = user.notificationList.find(
      (notification) => notification.notificationId === notificationId
    );
    notification.read = true;
  }
  await user.save();
  if (cache.has(userName)) {
    cache.set(userName, user);
  }
  return res.status(200).json("Notification updated!");
});

module.exports = {
  getNotificationList,
  deleteNotification,
  markReadNotification,
};
