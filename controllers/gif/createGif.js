const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const pool = require("../../db");
require('dotenv').config();

const newGif = async (req, res) => {
    try {
        const { title, image } = req.body;
        const imageData = await cloudinary.uploader.upload(image, {});
        
        const gifData = pool.query(
            "INSERT INTO gifs(title, image_url, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, imageData.secure_url, req.user.id]);
        gifData.then((result) => {
            result = result.rows[0];
            return res.status(201).json({
                status: "success",
                data: {
                    gifId: result.gifid,
                    message: "GIF image successfully posted",
                    createdOn: result.createdon,
                    title: result.title,
                    imageUrl: result.image_url
                }
            });
        })
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: "error",
            error: err.message
        });
    }
}

module.exports = { newGif };