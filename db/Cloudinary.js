import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    // Log a success message to the console
    console.log("Connected to Cloudinary successfully!");
  } catch (error) {
    // Log any errors that occur during configuration
    console.error("Error connecting to Cloudinary:", error.message);
  }
};

export default cloudinaryConnect;
