const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    const token = req.header("token");

    if(!token) {
        return res.status(401).json({
            message: "Authorization denied",
        });
    }

    try {
        const payload = jwt.verify(token, process.env.jwtSecret);
        req.user = payload.user;
        next();      
    } catch (err) {
        res.status(401).json({
            message: "Token is not valid"
        });
    }
};