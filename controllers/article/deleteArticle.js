const pool = require("../../db");

const deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const articleComments = await pool.query(
            "DELETE FROM comments WHERE article_id=$1 AND author_id=$2 RETURNING *",
            [articleId, req.user.id]);
            
        const articleData = await pool.query(
            "DELETE FROM articles WHERE articleid=$1 AND user_id=$2 RETURNING *",
            [articleId, req.user.id]);

            if (articleData.rows.length === 0) {
                return res.json({
                    message: "Don't have access"
                });
            }

        if (!articleData.rows[0]) {
            return res.status(404).send({'message': 'Article not found'});
        }

        return res.json({
            status: "success",
            data: {
                message: "Article successfully deleted"
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { deleteArticle };