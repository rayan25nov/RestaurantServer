import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import { io } from "../app.js";

// @desc    Place an order from the cart
// @route   POST /orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { total: totalMoney } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if the cart has items
    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cart is empty. Add items to the cart before placing an order.",
      });
    }

    // Create a new order
    const order = new Order({
      products: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      totalMoney: totalMoney,
      status: "Pending",
      user: req.user.id,
    });

    // Save the order to the database
    await order.save();

    // Empty the cart
    cart.items = [];
    await cart.save();

    io.emit("orderUpdated", order);

    res.status(201).json({
      success: true,
      data: order,
      message: "Order placed successfully",
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
// @route   GET /orders
// @access  Public
const getOrders = async (req, res) => {
  try {
    // Find the orders associated with the user and also populate the product associated with it
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product"
    );
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "you haven't ordered anything yet",
      });
    }

    // Return the orders for the user
    res.status(200).json({
      success: true,
      data: orders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while retrieving orders",
    });
  }
};

// @desc    Get all orders for admin
// @route   GET /orders/all-orders
// @access  Private
const getAllOrders = async (req, res) => {
  try {
    // Find all orders and populate the products
    const orders = await Order.find({}).populate("products.product");

    res.status(200).json({
      success: true,
      data: orders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while retrieving orders",
    });
  }
};

// @desc    Update order status
// @route   PUT orders/:orderId
// @access  Public
const updateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Emit order update event
    io.emit("orderUpdated", order);

    res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while updating the order status",
    });
  }
};

// @desc    Update payment status
// @route   PUT orders/payment/:orderId
// @access  Public
const updatePaymentStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the payment status
    order.paymentStatus = status;
    await order.save();

    // Emit order update event
    // console.log("Updating payment status...");
    io.emit("orderUpdated", order);
    // console.log("Payment status updated and emitted successfully");

    res.status(200).json({
      success: true,
      data: order,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while updating the payment status",
    });
  }
};

// @desc    Delete an order
// @route   DELETE /orders/:orderId
// @access  Public
const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order by ID and delete it
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    // Emit order delete event
    io.emit("orderDeleted", order._id);

    res.status(200).json({
      success: true,
      data: order,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while deleting the order",
    });
  }
};
export {
  placeOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
};
