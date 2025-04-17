const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const utilities = require("../utilities/");

router.post("/add", utilities.checkLogin, feedbackController.addFeedback);

module.exports = router;
