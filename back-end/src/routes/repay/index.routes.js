const express = require("express");

const repayController = require("../../controllers/repay");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getRepayHistory", repayController.getRepayHistory);

router.get("/getPendingRepay", repayController.getPendingRepay);

router.post("/makeRepayRequest", repayController.makeRepayRequest);

router.post("/responseRepay", repayController.responseRepay);

module.exports = router;
