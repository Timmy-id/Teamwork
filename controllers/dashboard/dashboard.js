const pool = require("../../db");

const dashboard = async (req, res) => {
    try {
        const user = await pool.query(
            "SELECT firstname, lastname, email, gender, jobrole, department FROM users WHERE userid=$1",
            [req.user.id]
        );
        return res.status(200).json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { dashboard };