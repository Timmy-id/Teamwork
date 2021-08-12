const pool = require("../../db");

const updateArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { title, article } = req.body;

        const articleData = await pool.query(
            "UPDATE articles SET title=$1, article=$2 WHERE articleid=$3 AND user_id=$4 RETURNING *",
            [title, article, articleId, req.user.id]);

        if (articleData.rows.length === 0) {
            return res.json({
                message: "Don't have access"
            });
        }

        res.json({
            status: "success",
            data: {
                message: "Article successfully updated",
                title: articleData.rows[0].title,
                article: articleData.rows[0].article
            }
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { updateArticle };