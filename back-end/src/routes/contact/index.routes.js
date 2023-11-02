const express = require("express");

const contactController = require("../../controllers/contact");
const authenticateJWT = require("../../middleware/authenticateJWT");

let router = express.Router();

router.use(authenticateJWT);

router.get("/getContacts", contactController.getContacts);

router.post("/addContact", contactController.addContact);

router.post("/removeContacts", contactController.removeContacts);

module.exports = router;
