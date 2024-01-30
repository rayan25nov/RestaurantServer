import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import dotenv from "dotenv";
dotenv.config();

// Middleware to check if the user is an admin
const requireAdmin = async (req, res, next) => {
  // Get the token from the request headers
  const token =
    req.cookies.jwt ||
    req.body.token ||
    req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Check if the user has the admin role
    const admin = await Admin.findOne({ _id: decodedToken.userId });

    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden - Admin access required", success: true });
    }

    // Attach the admin to the request object for further use
    req.admin = admin;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
      success: false,
      error: error.message,
    });
  }
};

export default requireAdmin;
