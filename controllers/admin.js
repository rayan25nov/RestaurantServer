import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// @desc    Register a new admin
// @route   POST /admin
// @access  Public
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // If no admin exists, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: newAdmin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong while registering admin",
      data: error.message,
    });
  }
};

// @desc    login a admin
// @route   POST /admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "1h", // Adjust the expiration time as needed
    });

    res
      .cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
      .status(200)
      .json({
        success: true,
        message: "Admin logged in successfully",
        data: admin,
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong while logging in admin",
      data: error.message,
    });
  }
};

// @desc    logout a admin
// @route   POST /admin/logout
// @access  Public
const logoutAdmin = async (req, res) => {
  res.clearCookie("jwt").status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

// @desc    Get admin profile
// @route   GET /admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;
    res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong while fetching admin profile",
      data: error.message,
    });
  }
};

// @desc    Update admin profile
// @route   PUT /admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;
    const { username, password } = req.body;

    // Update username and password if provided
    if (username) {
      admin.username = username;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong while updating admin profile",
      data: error.message,
    });
  }
};

// desc    Delete admin profile
// @route   DELETE /admin/profile
// @access  Private
const deleteAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;
    await Admin.findByIdAndDelete(admin._id);
    res.status(200).json({
      success: true,
      message: "Admin profile deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong while deleting admin profile",
      data: error.message,
    });
  }
};

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
};
