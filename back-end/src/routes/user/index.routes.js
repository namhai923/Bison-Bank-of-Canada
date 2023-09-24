const express = require("express");

const userController = require("../../controllers/user");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getInfo", userController.getInfo);

router.get("/getBalance", userController.getBalance);

router.get("/getExpense", userController.getExpense);

router.get("/getTransfer", userController.getTransfer);

router.get("/getContacts", userController.getContacts);

router.get("/getConversationsInfo", userController.getConversationsInfo);

router.get("/getConversation", userController.getConversation);

router.post("/updateInfo", userController.updateInfo);

router.post("/expense", userController.expense);

router.post("/transfer", userController.transfer);

router.post("/addContact", userController.addContact);

router.post("/removeContacts", userController.removeContacts);

router.post("/sendMessage", userController.sendMessage);

router.post("/deleteConversation", userController.deleteConversation);

module.exports = router;
