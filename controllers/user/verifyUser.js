const verifyUser = (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        // console.error(err.message);
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { verifyUser };