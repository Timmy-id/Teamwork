const pool = require("../../db");

const getAllArticlesAndGifs = async (req, res) => {
    try {
        const data = await pool.query(
            `SELECT articleid, createdon, title, article, user_id 
                FROM articles UNION ALL SELECT gifid, createdon, title,
                image_url, user_id FROM gifs ORDER BY createdon DESC`
        );
        // console.log(data.rows[0].createdon)
        let result = data.rows;

        return res.status(200).json({
            status: "success",
            data: result
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { getAllArticlesAndGifs };