const express = require("express");

const auth = require("./auth/index.routes");
const user = require("./user/index.routes");
const favor = require("./favor/index.routes");
const debt = require("./debt/index.routes");
const repay = require("./repay/index.routes");
const contact = require("./contact/index.routes");
const messenger = require("./messenger/index.routes");
const notification = require("./notification/index.routes");
const pokegene = require("./pokegene/index.routes");

let router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/favor", favor);
router.use("/debt", debt);
router.use("/repay", repay);
router.use("/contact", contact);
router.use("/messenger", messenger);
router.use("/notification", notification);
router.use("/pokegene", pokegene);

module.exports = router;
