const express = require("express");

const pokegeneController = require("../../controllers/pokegene");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getCollection", pokegeneController.getCollection);

router.post("/generatePokemon", pokegeneController.generatePokemon);

router.post("/removePokemon", pokegeneController.removePokemon);

router.post("/sendPokemon", pokegeneController.sendPokemon);

module.exports = router;
