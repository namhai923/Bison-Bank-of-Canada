const express = require("express");

const messengerController = require("../../controllers/messenger");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getConversationsInfo", messengerController.getConversationsInfo);

router.get("/getConversation", messengerController.getConversation);

router.post("/sendMessage", messengerController.sendMessage);

router.post("/deleteConversation", messengerController.deleteConversation);

module.exports = router;
