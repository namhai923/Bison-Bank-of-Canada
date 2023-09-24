const express = require("express");

const authenticateJWT = require("../../middleware/authenticateJWT");
const loginLimiter = require("../../middleware/loginLimiter");
const authController = require("../../controllers/auth");

let router = express.Router();

router.get("/refresh", authController.refresh);

router.post("/register", authController.register);

router.post("/login", loginLimiter, authController.login);

router.get("/logout", authenticateJWT, authController.logout);

module.exports = router;
