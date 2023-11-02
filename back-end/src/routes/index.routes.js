const express = require("express");

const user = require("./user/index.routes");
const auth = require("./auth/index.routes");

let router = express.Router();

router.use("/auth", auth);
router.use("/user", user);

module.exports = router;
