const pool = require("../../db");

const newArticleComment = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { comment } = req.body;
        const author = req.user.id;

        const articleComment = await pool.query(
            "INSERT INTO comments (comment, article_id, author_id) VALUES ($1, $2, $3) RETURNING *", 
            [comment, articleId, author]
        );

        const article = await pool.query(
            "SELECT title, article FROM articles WHERE articleid=$1",
            [articleId]
        );

        articleComment.rows[0].article = article.rows[0];
        const result = articleComment.rows[0];

        return res.status(201).json({
            status: "success",
            data: {
                message: "Comment successfully created",
                createdOn: result.createdon,
                articleTitle: result.article.title,
                article: result.article.article,
                comment: result.comment
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

module.exports = { newArticleComment };