const pool = require("../../db");

const gifComment = async (req, res) => {
    try {
        const { gifId } = req.params;
        const { comment } = req.body;
        const author = req.user.id;

        const gifComment = await pool.query(
            "INSERT INTO comments (comment, gif_id, author_id) VALUES ($1, $2, $3) RETURNING *", 
            [comment, gifId, author]
        );

        const gif = await pool.query(
            "SELECT title FROM gifs WHERE gifid=$1",
            [gifId]
        );

        gifComment.rows[0].gif = gif.rows[0];
        const result = gifComment.rows[0];

        return res.status(201).json({
            status: "success",
            data: {
                message: "Comment successfully created",
                createdOn: result.createdon,
                gifTitle: result.gif.title,
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

module.exports = { gifComment };