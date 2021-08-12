const pool = require("../../db");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../../utils/jwtGenerator");

const registerUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            userPassword,
            gender,
            jobRole,
            department,
            userAddress,
        } = req.body;

        const user = await pool.query("SELECT * from users WHERE email = $1",[
            email
        ]);

        if (user.rows.length !== 0) {
            return res.status(400).json({
                message: "User already exist"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(userPassword, salt);

        let newUser = await pool.query(
            `INSERT INTO users (
                firstName,
                lastName,
                email,
                userPassword,
                gender,
                jobRole,
                department,
                userAddress
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [firstName, lastName, email, bcryptPassword, gender, jobRole, department, userAddress]
        );
        const jwtToken = jwtGenerator(newUser.rows[0].userid);

        return res.status(201).json({
            status: "success",
            data: {
                message: "User account successfully created",
                token: jwtToken,
                userId: newUser.rows[0].userid,
                firstName: firstName,
                lastName: lastName,
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { registerUser };