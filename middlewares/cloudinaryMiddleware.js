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
      error: "Something went wrong while uploading image to cloudinary",
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
      error: "Something went wrong while deleting image from cloudinary",
      message: error.message,
    });
  }
};

export { uploadImage, deleteImage };
