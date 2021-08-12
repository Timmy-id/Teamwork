const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const feedController = require("../controllers/feed/feedController");

router.get("/", authorize, feedController.getAllArticlesAndGifs);

module.exports = router;