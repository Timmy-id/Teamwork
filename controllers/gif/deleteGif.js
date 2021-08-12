const pool = require("../../db");

const deleteGif = async (req, res) => {
    try {
        const { gifId } = req.params;
        const gifComments = await pool.query(
            "DELETE FROM comments WHERE gif_id=$1 AND author_id=$2 RETURNING *",
            [gifId, req.user.id]);
            
        const gifData = await pool.query(
            "DELETE FROM gifs WHERE gifid=$1 AND user_id=$2 RETURNING *",
            [gifId, req.user.id]);

            if (gifData.rows.length === 0) {
                return res.json({
                    message: "Don't have access"
                });
            }

        if (!gifData.rows[0]) {
            return res.status(404).send({'message': 'Gif not found'});
        }

        return res.json({
            status: "success",
            data: {
                message: "gif post successfully deleted"
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { deleteGif };