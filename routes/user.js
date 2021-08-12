const express = require("express");
const router = express.Router();
const registerUserController = require("../controllers/user/registerUser")
const signInUserController = require("../controllers/user/signInUser");
const verifyUserController = require("../controllers/user/verifyUser");
const authorize = require("../middlewares/authorize");
const validInfo = require("../middlewares/validInfo");

router.post("/create-user", validInfo, registerUserController.registerUser);
router.post("/signin", validInfo, signInUserController.signInUser);
router.get("/verify", authorize, verifyUserController.verifyUser);

module.exports = router;