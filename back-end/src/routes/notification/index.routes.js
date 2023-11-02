const express = require("express");

const notificationController = require("../../controllers/notification");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getNotificationList", notificationController.getNotificationList);

router.post("/deleteNotification", notificationController.deleteNotification);

router.post(
  "/markReadNotification",
  notificationController.markReadNotification
);

module.exports = router;
