import Order from "../models/orderModel.js";
import Table from "../models/tableModel.js";

// @desc    Fetch all orders
// @route   GET /orders
// @access  Public
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
    res.status(200).json({
      data: orders,
      success: true,
      message: "All orders fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Something went wrong while fetching all orders",
    });
  }
};

// @desc    Create a new order
// @route   POST /orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    // check if the table is empty
    const table = await Table.find({ status: "free", number: req.body.number });
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table is Occupied right now",
      });
    }
    // if table is empty create a new order
    const order = new Order(req.body);
    await order.save();

    // update the table status to occupied
    await Table.findByIdAndUpdate(table._id, { status: "occupied" });
    res.status(201).json({
      order,
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      success: false,
      message: "Something went wrong while creating the order",
    });
  }
};

// @desc    Get a specific Order
// @route   GET /orders/:id
// @access  Public
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      data: order,
      success: true,
      message: "Order fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Something went wrong while fetching the order",
    });
  }
};

// @desc    Update an order
// @route   PUT /orders/:id
// @access  Private
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      data: order,
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Something went wrong while updating the order",
    });
  }
};

// @desc    Delete an order
// @route   DELETE /orders/:id
// @access  Private
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      data: order,
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Something went wrong while deleting the order",
    });
  }
};

export { getAllOrders, createOrder, getOrder, updateOrder, deleteOrder };
