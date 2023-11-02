const express = require("express");

const favorController = require("../../controllers/favor");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getFavorSummary", favorController.getFavorSummary);

router.get("/getFavorHistory", favorController.getFavorHistory);

router.get("/getPendingFavor", favorController.getPendingFavor);

router.post("/makeFavorRequest", favorController.makeFavorRequest);

router.post("/responseFavor", favorController.responseFavor);

module.exports = router;
