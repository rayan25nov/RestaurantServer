import OldOrder from "../models/oldOrderModel.js";
import Order from "../models/orderModel.js";

// @desc    Add the order to the old order after delivery
// @route   POST /old-orders
// @access  Private
const addOrder = async (req, res) => {
  try {
    const user = req.user.id;
    const order = await Order.find({ user: user }).populate("products.product");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "you haven't ordered anything yet",
      });
    }
    // console.log(order);
    // create a new old order
    const oldOrder = new OldOrder({
      products: order[0].products,
      totalMoney: order[0].totalMoney,
      user: user,
    });
    // save old order and delete data from order
    await oldOrder.save();
    await Order.deleteMany({ user: user });

    res.status(201).json({
      success: true,
      data: oldOrder,
      message: "Old Order created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while placing the order",
    });
  }
};

// @desc    Get all orders for specific user
// @route   GET /old-orders
// @access  Public
const getOrders = async (req, res) => {
  try {
    // Find the Old orders associated with the user and also populate the product associated with it
    const oldOrders = await OldOrder.find({ user: req.user.id }).populate(
      "products.product"
    );
    if (!oldOrders) {
      return res.status(404).json({
        success: false,
        message: "you haven't ordered anything yet",
      });
    }

    // Return the orders for the user
    res.status(200).json({
      success: true,
      data: oldOrders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while retrieving Old orders",
    });
  }
};

// @desc    Get all orders for admin
// @route   GET /old-orders/all-orders
// @access  Private
const getAllOrders = async (req, res) => {
  try {
    const user = req.user.id;
    // Find all orders for a particular user and populate the product associated with it
    const orders = await OldOrder.find({ user: user }).populate(
      "products.product"
    );
    // Reverse the order of the fetched orders so that new orders appear first
    const reversedOrders = orders.reverse();
    res.status(200).json({
      success: true,
      data: reversedOrders,
      message: "All Orders retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while retrieving orders",
    });
  }
};

// @desc    Get all orders all users for admin
// @route   GET /admin/all-orders
// @access  Private
const getAllOrdersOfAllUser = async (req, res) => {
  try {
    // Find all orders and populate the product associated with it
    const orders = await OldOrder.find().populate("products.product");
    // Reverse the order of the fetched orders so that new orders appear first
    const reversedOrders = orders.reverse();
    res.status(200).json({
      success: true,
      data: reversedOrders,
      message: "All Orders retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while retrieving orders",
    });
  }
};

export { addOrder, getOrders, getAllOrders, getAllOrdersOfAllUser };
