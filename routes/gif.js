const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const createGifController = require("../controllers/gif/createGif");
const createGifCommentController = require("../controllers/gif/createGifComment");
const getOneGifController = require("../controllers/gif/getOneGif");
const deleteGifController = require("../controllers/gif/deleteGif");

router.post("/", authorize, createGifController.newGif);
router.post("/:gifId/comment", authorize, createGifCommentController.gifComment);
router.get("/:gifId", authorize, getOneGifController.getOneGif);
router.delete("/:gifId", authorize, deleteGifController.deleteGif);


module.exports = router;
