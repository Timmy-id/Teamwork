const pool = require("../../db");

const newArticle = async (req, res) => {
    try {
        const { title, article } = req.body;

        if (!title || !article) {
            return res.status(400).json({
                message: "Title or article is missing"
            });
        }

        const articleData = await pool.query(
            "INSERT INTO articles(title, article, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, article, req.user.id]);
        return res.json({
            status: "success",
            data: {
                message: "Article successfully posted",
                articleId: articleData.rows[0].articleid,
                createdOn: articleData.rows[0].created,
                title: title
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { newArticle };