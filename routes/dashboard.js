const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard/dashboard");
const authorize = require("../middlewares/authorize");

router.get("/", authorize, dashboardController.dashboard);

module.exports = router;