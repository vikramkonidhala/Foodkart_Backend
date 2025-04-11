const cloudinary = require("cloudinary").v2;
const dotEnv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotEnv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "foodkartuploads",
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.log("Local file not found for deletion:");
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Image deletion failed");
  }
};

module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary };
