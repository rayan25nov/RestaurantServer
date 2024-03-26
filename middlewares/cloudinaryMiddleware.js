import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (req, res) => {
  try {
    const file = req.files?.image;
    // console.log(req);

    // Check if a file is provided in the request
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Upload the file to Cloudinary in the 'images' folder
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "images",
    });

    console.log(result);

    // Save the Cloudinary image URL and other details to res.locals
    res.locals.uploadResult = {
      success: true,
      imageUrl: result.secure_url,
    };
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

const deleteImage = async (imageUrl) => {
  try {
    // Delete the image from Cloudinary
    const modifiedImageUrl = `images/${imageUrl
      .split("/")
      .pop()
      .replace(/\.\w+$/, "")}`;
    await cloudinary.uploader.destroy(modifiedImageUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

const deleteImageByFile = async (file) => {
  try {
    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(file.public_id);
    console.log(result);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete image");
  }
};

export { uploadImage, deleteImage, deleteImageByFile };
