const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const createArticleController = require("../controllers/article/createArticle");
const getOneArticleController = require("../controllers/article/getOneArticle");
const updateArticleController = require("../controllers/article/updateArticle");
const deleteArticleController = require("../controllers/article/deleteArticle");
const createArticleCommentController = require("../controllers/article/createArticleComment");

router.post("/", authorize, createArticleController.newArticle);
router.get("/:articleId", authorize, getOneArticleController.getOneArticle);
router.patch("/:articleId", authorize, updateArticleController.updateArticle);
router.delete("/:articleId", authorize, deleteArticleController.deleteArticle);
router.post("/:articleId/comment", authorize, createArticleCommentController.newArticleComment);

module.exports = router;