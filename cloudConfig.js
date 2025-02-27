const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

//integrating backend with cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});

//creating a folder in cloudinary to store our data
const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "unbannest_DEV",
        allowedFormats : ["png","jpg","jpeg"],
    },
});

module.exports = {
    cloudinary, storage
};
