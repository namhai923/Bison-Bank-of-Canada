const express = require("express");

const authenticateJWT = require("../../middleware/authenticateJWT");
const loginLimiter = require("../../middleware/loginLimiter");
const authController = require("../../controllers/auth");

let router = express.Router();

router.post("/refresh", authController.refresh);

router.post("/register", authController.register);

router.post("/login", loginLimiter, authController.login);

router.post("/logout", authenticateJWT, authController.logout);

module.exports = router;
