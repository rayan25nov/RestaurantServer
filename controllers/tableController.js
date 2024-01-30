import Table from "../models/tableModel.js";

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
  const table = new Table(req.body);
  try {
    await table.save();
    res.status(201).json({
      success: true,
      message: "Table created successfully",
      data: table,
    });
  } catch (error) {
    res.status(409).json({
      success: false,
      message: error.message,
      message: "Something went wrong while creating the table",
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

// @desc    Delete table
// @route   DELETE /:id
// @access  Private
const deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
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
  deleteTable,
};
