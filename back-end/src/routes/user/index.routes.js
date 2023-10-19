const express = require("express");

const userController = require("../../controllers/user");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getInfo", userController.getInfo);

router.get("/getFavorSummary", userController.getFavorSummary);

router.get("/getDebtSummary", userController.getDebtSummary);

router.get("/getFavorHistory", userController.getFavorHistory);

router.get("/getDebtHistory", userController.getDebtHistory);

router.get("/getRepayHistory", userController.getRepayHistory);

router.get("/getPendingFavor", userController.getPendingFavor);

router.get("/getPendingRepay", userController.getPendingRepay);

router.get("/getContacts", userController.getContacts);

router.get("/getNotificationList", userController.getNotificationList);

router.get("/getConversationsInfo", userController.getConversationsInfo);

router.get("/getConversation", userController.getConversation);

router.get("/searchUser", userController.searchUser);

router.post("/updateInfo", userController.updateInfo);

router.post("/makeFavorRequest", userController.makeFavorRequest);

router.post("/makeRepayRequest", userController.makeRepayRequest);

router.post("/responseFavor", userController.responseFavor);

router.post("/responseRepay", userController.responseRepay);

router.post("/addContact", userController.addContact);

router.post("/removeContacts", userController.removeContacts);

router.post("/sendMessage", userController.sendMessage);

router.post("/deleteConversation", userController.deleteConversation);

router.post("/deleteNotification", userController.deleteNotification);

router.post("/markReadNotification", userController.markReadNotification);

module.exports = router;
