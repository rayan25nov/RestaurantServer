import Table from "../models/tableModel.js";
import Cart from "../models/cartModel.js";
import { generateQR, deleteQr } from "../utils/generateQR.js";

// @desc    Get all tables
// @route   GET /
// @access  Public
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
      message: "All Tables data fetched",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      success: false,
      message: "Something went wrong while fetching the tables",
    });
  }
};

// @desc    Create a table
// @route   POST /
// @access  Public
const createTable = async (req, res) => {
  const { number } = req.body;

  try {
    // Check if the table with the given number already exists
    const existingTable = await Table.findOne({ number });

    if (existingTable) {
      return res.status(409).json({
        success: false,
        message: `Table with number ${number} already exists`,
      });
    }
    // Create a new cart for the table
    const cart = new Cart();
    await cart.save();

    // Generate QR code for the table
    const qrCodeFilePath = await generateQR(number);

    // Create a new table
    const table = new Table({
      number,
      status: "free", // Set the initial status to "free" or adjust as needed
      qrCode: qrCodeFilePath,
      cart: cart._id, // Set the cart ID for the table
    });

    // Save the table
    await table.save();

    res.status(201).json({
      success: true,
      message: "Table created successfully",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the table",
      error: error.message,
    });
  }
};

// @desc    Get table status
// @route   GET /status
// @access  Public
const getTablesStatus = async (req, res) => {
  try {
    // console.log(req.params.status);
    const table = await Table.find({ status: req.params.status });
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }
    res.status(200).json({
      success: true,
      count: table.length,
      data: table,
      message: "Table status fetched successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      message: "Something went wrong while fetching the table status",
    });
  }
};

// @desc    Update table status
// @route   PUT /status
// @access  Public
const changeTableStatus = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }
    res.status(200).json({
      success: true,
      data: table,
      message: "Table status updated successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      message: "Something went wrong while updating the table status",
    });
  }
};

// @desc    Reserve a table
// @route   PUT /reserve
// @access  Public
const reserveTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status: "reserved" },
      { new: true }
    );
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }
    res.status(200).json({
      success: true,
      data: table,
      message: "Table reserved successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      message: "Something went wrong while reserving the table",
    });
  }
};

// @desc    Release a table
// @route   PUT /release
// @access  Public
const releaseTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status: "free" },
      { new: true }
    );
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }
    res.status(200).json({
      success: true,
      data: table,
      message: "Table released successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      message: "Something went wrong while releasing the table",
    });
  }
};

// @desc    Delete table
// @route   DELETE /:id
// @access  Private
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }
    await deleteQr(table.qrCode);
    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      message: "Something went wrong while deleting the table",
    });
  }
};

export {
  getAllTables,
  createTable,
  getTablesStatus,
  changeTableStatus,
  reserveTable,
  releaseTable,
  deleteTable,
};
