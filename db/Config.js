import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

// Database Connection
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connection with MongoDB: OK");
  } catch (e) {
    console.log("Error connecting to MongoDB: \n" + e);
  }
};

export default dbConnection;
