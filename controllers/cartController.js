import Cart from "../models/cartModel.js";

// @desc    Get all cart items for specific user
// @route   GET /
// @access  Private
const getAllCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({
        message: "No Items found in the Cart.",
        success: false,
        data: [],
        length: 0,
      });
    }

    res.status(200).json({
      data: cart.items,
      length: cart.items.length,
      success: true,
      message: "Cart items fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while fetching all cart items",
      success: false,
    });
  }
};

// @desc    Add item to cart
// @route   POST /add
// @access  Private

const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const item = cart.items.find((item) => item.product == productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({
      data: cart.items,
      length: cart.items.length,
      success: true,
      message: "Items added successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Error adding item to cart",
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /update/:productId
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    const item = cart.items.find(
      (item) => item.product == req.params.productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in cart", success: false });
    }
    item.quantity += quantity;
    // if items quantity becomes 0 remove items from the cart
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product != req.params.productId
      );
    }
    await cart.save();
    res.status(200).json({
      data: cart.items,
      length: cart.items.length,
      updated: item, // updated item with new quantity value
      success: true,
      message: "Quantity updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Error while updating quantity",
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /cart/:productId
// @access  Private
const removeItemFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const item = cart.items.find(
      (item) => item.product == req.params.productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in cart", success: false });
    }

    cart.items = cart.items.filter(
      (item) => item.product != req.params.productId
    );
    await cart.save();
    res.status(200).json({
      data: cart.items,
      length: cart.items.length,
      updated: item, // updated item with new quantity value
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Error removing item from cart",
    });
  }
};

// @desc    Clear cart
// @route   DELETE /cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    const removed = cart.items.map((item) => item.product);
    cart.items = [];
    await cart.save();
    res.status(200).json({
      data: [],
      length: 0,
      removed: removed,
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Error clearing cart",
    });
  }
};

export {
  getAllCartItems,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
};
