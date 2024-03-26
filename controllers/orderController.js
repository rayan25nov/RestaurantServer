import Order from "../models/orderModel.js";
import Table from "../models/tableModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc    Place an order from the cart
// @route   POST /place-order/:tableNumber
// @access  Public
const placeOrder = async (req, res) => {
  const tableNumber = req.params.tableNumber;

  try {
    // Find the table based on the provided table number
    const table = await Table.findOne({ number: tableNumber, status: "free" });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Find the cart associated with the table
    const cart = await Cart.findById(table.cart);

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

    // Calculate the total money based on the items in the cart
    let totalMoney = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      totalMoney += product.price * item.quantity;
    }
    // console.log(totalMoney);
    // Create a new order
    const order = new Order({
      table: table._id,
      cart: cart._id,
      products: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      totalMoney: totalMoney,
      status: "pending",
    });

    // Save the order to the database
    await order.save();

    // Empty the cart
    cart.items = [];
    await cart.save();

    // Add the order to the table's orders array
    table.orders.push(order._id);
    await table.save();

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

// @desc    Get all orders for specific table
// @route   GET /:tableNumber
// @access  Public
const getOrders = async (req, res) => {
  const tableNumber = req.params.tableNumber;

  try {
    // Find the table based on the provided table number
    const table = await Table.findOne({ number: tableNumber });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Find the orders associated with the table
    const orders = await Order.find({ table: table._id });

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

// @desc    Get all orders for all tables
// @route   GET /
// @access  Public
const getAllOrders = async (req, res) => {
  try {
    // Find all orders
    const orders = await Order.find();

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
// @route   PUT /update-status/:orderId
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

// @desc    Delete order
// @route   DELETE /delete-order/:orderId
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
    // Remove the order from the table's orders array
    const table = await Table.findById(order.table);
    table.orders.pull(orderId);
    await table.save();

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
export { placeOrder, getOrders, getAllOrders, updateOrderStatus, deleteOrder };
