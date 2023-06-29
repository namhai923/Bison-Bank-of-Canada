const express = require("express");

const userController = require("../../controllers/user");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.post("/getInfo", userController.getInfo);

router.post("/updateInfo", userController.updateInfo);

router.post("/transfer", userController.transfer);

router.post("/expense", userController.expense);

module.exports = router;
