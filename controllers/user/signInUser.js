const pool = require("../../db");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../../utils/jwtGenerator");

const signInUser = async (req, res) => {
    try {
        const { email, userPassword } = req.body;
        if (!email || !userPassword) {
            return res.status(400).json({
                message: "Email or password is missing"
            });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", 
        [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Invalid credentials");
        }

        const validPassword = await bcrypt.compare(
            userPassword,
            user.rows[0].userpassword
        );

        if (!validPassword) {
            return res.status(401).json("Invalid credentials");
        }

        const data = user.rows[0];

        const jwtToken = jwtGenerator(user.rows[0].userid);
        return res.status(200).json({
            status: "success",
            data: {
                token: jwtToken,
                userId: data.userid,
                firstName: data.firstname,
                lastName: data.lastname,
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

module.exports = { signInUser };