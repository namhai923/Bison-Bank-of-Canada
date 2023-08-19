const express = require("express");

const userController = require("../../controllers/user");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getInfo", userController.getInfo);

router.get("/getBalance", userController.getBalance);

router.get("/getExpense", userController.getExpense);

router.get("/getTransfer", userController.getTransfer);

router.post("/updateInfo", userController.updateInfo);

router.post("/expense", userController.expense);

router.post("/transfer", userController.transfer);

module.exports = router;
