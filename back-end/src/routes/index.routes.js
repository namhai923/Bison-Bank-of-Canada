const express = require("express");
const user = require("./user/index.routes");
const admin = require("./admin/index.routes");

let router = express.Router();

router.use("/user", user);
router.use("/admin", admin);

module.exports = router;
