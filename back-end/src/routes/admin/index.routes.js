const express = require("express");

const adminController = require("../../controllers/admin");

let router = express.Router();

router.post("/sendRecords", adminController.sendRecords);

module.exports = router;
