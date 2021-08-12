const pool = require("../../db");

const getOneArticle = async (req, res) => {
    try {
        const { articleId } = req.params;

        const article = await pool.query(
            "SELECT * FROM articles WHERE articleid=$1 AND user_id=$2",
            [articleId, req.user.id]
        );

        if (article.rows.length === 0) {
            return res.json({
                message: "Don't have access"
            });
        }

        if (!article.rows[0]) {
            return res.status(404).send({'message': 'Article not found'});
        }

        const comments = await pool.query(
            "SELECT commentid, comment, author_id FROM comments WHERE article_id=$1",
            [articleId]
        );

        article.rows[0].comments = comments.rows;
        const result = article.rows[0];
        return res.status(200).json({
            status: "success",
            data: {
                id: result.artilceid,
                createdon: result.created,
                title: result.title,
                article: result.article,
                comments: result.comments
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

module.exports = { getOneArticle };