module.exports = function (req, res, next) {
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

    function validEmail(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    if (req.path === "/create-user") {
        // console.log(!email.length);
        if (![firstName,
            lastName,
            email,
            userPassword,
            gender,
            jobRole,
            department,
            userAddress].every(Boolean)) {
                return res.status(400).json("Missing Credentials");
        } else if (!validEmail(email)) {
                return res.json("Invalid Email");
        }
    } else if (req.path === "/signin") {
        if (![email, userPassword].every(Boolean)) {
            return res.status(400).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.json("Invalid Email");
        }
    }
    next();
}