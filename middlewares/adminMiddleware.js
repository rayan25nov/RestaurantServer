import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Staff from "../models/staffModel.js";
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
// middleware to check if user is an user
const requireAuth = async (req, res, next) => {
  try {
    // console.log(req.headers);
    const token =
      req.cookies.jwt ||
      req.body.token ||
      req.headers.authorization.replace("Bearer ", "");
    // console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token in cookie", success: false });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decode);
    req.user = decode;

    next();
  } catch (error) {
    // console.log(error);
    return res.status(401).json({
      error: error.message,
      message: "Something went wrong during decoding token of an user",
      success: false,
    });
  }
};
// middleware to check if user is a Chef
const requireStaff = async (req, res, next) => {
  try {
    const token =
      req.cookies.jwt ||
      req.body.token ||
      req.headers.authorization.replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);
    // Check if the user has the chef or waiter role
    const user = await Staff.findOne({ _id: decode.userId });

    if (
      !user ||
      (user.accessLevel !== "chef" &&
        user.accessLevel !== "waiter" &&
        user.accessLevel !== "accountant")
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden - Staff access required", success: false });
    }

    // Attach the user to the request object for further use
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: error.message,
      message: "Something went wrong during decoding token of a Staff",
      success: false,
    });
  }
};

// Middleware to check token expiration
const checkTokenExpiration = (req, res) => {
  const token =
    req.cookies.jwt ||
    req.body.token ||
    req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing token", expired: true });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decodedToken);
    if (decodedToken.exp < Date.now() / 1000) {
      return res.status(401).json({
        message: "Token Expired",
        expired: true,
        decodedToken,
      });
    }
    return res.status(200).json({
      message: "Token is valid",
      expired: false,
      decodedToken,
    });
  } catch (error) {
    // console.error("Error verifying token:", error);
    return res.status(401).json({
      message: "Token Expired",
      expired: true,
    });
  }
};

export { requireAdmin, checkTokenExpiration, requireAuth, requireStaff };
