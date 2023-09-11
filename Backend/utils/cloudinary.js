const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

// cloudinary upload image to cloudinary website

const cloudinaryUploadImage = async (fileToUpload) => {
    try {

        // data which is url , public_id 

        const data = await cloudinary.uploader.upload(fileToUpload,{
            resource_type: "auto",
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};




// cloudinary Remove image from cloudinary website

const cloudinaryRemoveImage = async (imagePublicId) => {
    try {

        // delete image from cloudinary website
        
        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;

    } catch (error) {
        console.log(error);
    }
};

module.exports = { cloudinaryUploadImage, cloudinaryRemoveImage };