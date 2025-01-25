const express = require("express");
const router = express.Router();
const contactForm = require("../controller/contect-controller");
router.post("/contect", contactForm);

module.exports = router;
