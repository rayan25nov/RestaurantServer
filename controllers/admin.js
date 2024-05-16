import Admin from "../models/adminModel.js";
import Token from "../models/tokenModel.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// @desc    Register a new admin
// @route   POST /admin
// @access  Public
const registerAdmin = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // If no admin exists, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      username,
      password: hashedPassword,
    });

    await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newAdmin._id, role: "admin" },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Admin registered successfully",
        data: newAdmin,
        token,
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
    const token = jwt.sign(
      { userId: admin._id, role: "admin" },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h", // Adjust the expiration time as needed
      }
    );

    res
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Admin logged in successfully",
        data: admin,
        token,
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

// @desc      Forgot password
// @route     POST /admin/forgot-password
// @access    Public  // VERIFIED
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
      });
    }
    // Check if a reset token already exists for the user
    const existingToken = await Token.findOne({ userId: admin._id });

    if (existingToken) {
      return res.status(409).json({
        message: "An Email is Already been sent to reset the password",
        success: false,
      });
    }
    // Generate a reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Save the reset token to the database
    const token = new Token({
      userId: user._id,
      token: resetToken,
    });
    await token.save();

    const url = `${process.env.BASE_URL}admin/${admin.id}/reset-password/${token.token}`;
    await mailSender(
      admin.email,
      "Reset Password",
      "Please click the button below to Reset Password.",
      url
    );
    // Send the reset token to the user's email
    res.status(200).json({
      message: "Reset token sent to email",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while sending email to reset password",
      error: error.message,
      success: false,
    });
  }
};

//  @desc      Reset password
// @route     POST /admin/:id/reset-password/:token
// @access    Public  // VERIFIED
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { id, token } = req.params;

  try {
    // Find the user by ID
    const user = await Admin.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // Find the token by token
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      return res.status(404).json({
        message: "Token not found",
        success: false,
      });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    // Delete the token
    await tokenDoc.delete();
    // Send a success response
    res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    // Send an error response
    res.status(500).json({
      message: "Something went wrong while resetting password",
      error: error.message,
      success: false,
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
  forgotPassword,
  resetPassword,
};
