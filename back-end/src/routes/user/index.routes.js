const express = require("express");

const userController = require("../../controllers/user");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getInfo", userController.getInfo);

// router.get("/getBalance", userController.getBalance);

router.get("/getFavorSummary", userController.getFavorSummary);

router.get("/getDebtSummary", userController.getDebtSummary);

// router.get("/getExpense", userController.getExpense);

// router.get("/getTransfer", userController.getTransfer);

router.get("/getFavorHistory", userController.getFavorHistory);

router.get("/getDebtHistory", userController.getDebtHistory);

router.get("/getContacts", userController.getContacts);

router.get("/getConversationsInfo", userController.getConversationsInfo);

router.get("/getConversation", userController.getConversation);

router.post("/updateInfo", userController.updateInfo);

// router.post("/expense", userController.expense);

// router.post("/transfer", userController.transfer);

router.post("/makeFavor", userController.makeFavor);

router.post("/payDebt", userController.payDebt);

router.post("/acceptFavor", userController.acceptFavor);

router.post("/acceptDebt", userController.acceptDebt);

router.post("/declineFavor", userController.declineFavor);

router.post("/declineDebt", userController.declineDebt);

router.post("/addContact", userController.addContact);

router.post("/removeContacts", userController.removeContacts);

router.post("/sendMessage", userController.sendMessage);

router.post("/deleteConversation", userController.deleteConversation);

module.exports = router;
