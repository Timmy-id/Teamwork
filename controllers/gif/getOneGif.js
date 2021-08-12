const pool = require("../../db");

const getOneGif = async (req, res) => {
    try {
        const { gifId } = req.params;

        const gif = await pool.query(
            "SELECT * FROM gifs WHERE gifid=$1 AND user_id=$2",
            [gifId, req.user.id]
        );

        if (gif.rows.length === 0) {
            return res.json({
                message: "Don't have access"
            });
        }

        if (!gif.rows[0]) {
            return res.status(404).send({'message': 'Gif not found'});
        }

        const comments = await pool.query(
            "SELECT commentid, comment, author_id FROM comments WHERE gif_id=$1",
            [gifId]
        );

        gif.rows[0].comments = comments.rows;
        const result = gif.rows[0];
        return res.status(200).json({
            status: "success",
            data: {
                id: result.gifid,
                createdon: result.createdon,
                title: result.title,
                url: result.image_url,
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

module.exports = { getOneGif };