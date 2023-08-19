const express = require("express");

const user = require("./user/index.routes");
const admin = require("./admin/index.routes");
const auth = require("./auth/index.routes");

let router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/admin", admin);

module.exports = router;
