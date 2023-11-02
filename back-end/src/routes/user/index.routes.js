const express = require("express");

const userController = require("../../controllers/user");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getInfo", userController.getInfo);

router.get("/searchUser", userController.searchUser);

router.post("/updateInfo", userController.updateInfo);

module.exports = router;
