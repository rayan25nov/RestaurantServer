import Cart from "../models/cartModel.js";

// @desc    Fetch all carts items
// @route   GET /carts
// @access  Public
const getAllCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne(); // Assuming only one cart for simplicity
    res.status(200).json({
      success: true,
      data: cart.items,
      message: "Cart items retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Something went wrong while fetching cart items",
    });
  }
};

// @desc    Add item to the cart
// @route   POST /carts
// @access  Public
const addItemToCart = async (req, res) => {
  const newItem = req.body;
  try {
    const cart = await Cart.findOne(); // Assuming only one cart for simplicity
    cart.items.push(newItem);
    await cart.save();
    res.status(201).json({
      success: true,
      data: cart.items,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      success: false,
      message: "Something went wrong while adding item to cart",
    });
  }
};

// @desc    Remove item from the cart
// @route   DELETE /carts/:itemId
// @access  Public
const removeItemFromCart = async (req, res) => {
  const itemId = req.params.itemId;
  try {
    const cart = await Cart.findOne(); // Assuming only one cart for simplicity
    cart.items = cart.items.filter((item) => item.id !== itemId);
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart.items,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Something went wrong while removing item from cart",
    });
  }
};

// @desc    Clear the cart
// @route   DELETE /carts
// @access  Public
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne(); // Assuming only one cart for simplicity
    cart.items = [];
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart.items,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Something went wrong while clearing the cart",
    });
  }
};

export { getAllCartItems, addItemToCart, removeItemFromCart, clearCart };
