import Staff from "../models/staffModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// @desc    Get all staff
// @route   GET /staff
// @access  private
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "No staff found" });
    }
    res.status(200).json({
      success: true,
      data: staff,
      message: "All Staff Member fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all staff",
      error: error.message,
    });
  }
};
// @desc    create a new staff
// @route   POST /staff
// @access  Private
const createStaff = async (req, res) => {
  try {
    const { name, age, phoneNumber, email, accessLevel, password } = req.body;
    // Check if the staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: "Staff already exists",
      });
    }
    // Hash the password before saving it to the database.
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new staff object and save it to the database.
    const newStaff = new Staff({
      name,
      age,
      phoneNumber,
      accessLevel,
      email,
      password: hashedPassword,
    });
    await newStaff.save();
    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: newStaff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating a staff",
      error: error.message,
    });
  }
};

//  @desc    Update a staff
//  @route   PUT /staff/:id
//  @access  Private
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    res.status(200).json({
      success: true,
      data: staff,
      message: "Staff Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating a staff",
      error: error.message,
    });
  }
};

//  @desc    Delete a staff
//  @route   DELETE /staff/:id
//  @access  Private
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    res.status(200).json({
      success: true,
      data: staff,
      message: "Staff Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting a staff",
      error: error.message,
    });
  }
};

// @desc    Login a staff
// @route   POST /staff/login
// @access  Public
const loginStaff = async (req, res) => {
  const { email, password } = req.body;
  try {
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: staff._id }, process.env.SECRET_KEY, {
      expiresIn: "1h", // Adjust the expiration time as needed
    });
    // generate cookie and send it to the client
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
      .status(200)
      .json({
        success: true,
        message: "Staff logged in successfully",
        data: staff,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in a staff",
      error: error.message,
    });
  }
};
// @desc    Logout a staff
// @route   POST /staff/logout
// @access  Private
const logoutStaff = async (req, res) => {
  res.clearCookie("jwt").status(200).json({
    success: true,
    message: "Staff logged out successfully",
  });
};
// @desc    Get staff profile
// @route   GET /staff/profile
// @access  Private
const getStaffProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    res.status(200).json({
      success: true,
      message: "Staff profile fetched successfully",
      data: staff,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong while fetching staff profile",
      data: error.message,
    });
  }
};
export {
  getStaffProfile,
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff,
  logoutStaff,
};
