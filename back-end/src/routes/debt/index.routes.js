const express = require("express");

const debtController = require("../../controllers/debt");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getDebtSummary", debtController.getDebtSummary);

router.get("/getDebtHistory", debtController.getDebtHistory);

module.exports = router;
