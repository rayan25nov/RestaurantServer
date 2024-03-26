import Cart from "../models/cartModel.js";
import Table from "../models/tableModel.js";
import Product from "../models/productModel.js";

// @desc    Fetch all carts items related to specific table
// @route   GET /:tableNumber
// @access  Public

const getAllCartItems = async (req, res) => {
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

    // Find the cart associated with the table
    const cart = await Cart.findById(table.cart);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the product details for each item in the cart
    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Combine product details with quantity from the cart
    const cartItems = cart.items.map((item) => ({
      product: products.find((product) => product._id.equals(item.product)),
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: cartItems,
      message: "Cart items fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while fetching cart items",
    });
  }
};

// @desc    Add product to the cart of a specific table
// @route   POST /addToCart/:tableNumber
// @access  Public
const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
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

    // Find or create a cart associated with the table
    let cart = await Cart.findOne({ _id: table.cart });

    if (!cart) {
      cart = new Cart();
      await cart.save();
      table.cart = cart._id;
      await table.save();
    }

    // Find the product based on the provided product ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If the same product is already in the cart, update its quantity inside the product
    const existingItem = cart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );
    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await cart.save();
      return res.status(200).json({
        success: true,
        data: cart,
        message: "Product quantity updated successfully",
      });
    }

    // Add the product to the cart
    cart.items.push({
      product: product._id,
      quantity: quantity || 1,
    });

    await cart.save();

    res.status(201).json({
      success: true,
      data: cart,
      message: "Product added to the cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while adding product to the cart",
    });
  }
};

// @desc    Update product quantity in the cart of a specific table
// @route   PUT /updateCart/:tableNumber
// @access  Public
const updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
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

    // Find the cart associated with the table
    const cart = await Cart.findOne({ _id: table.cart });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the product based on the provided product ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // Update the quantity of the product in the cart
    const item = cart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );
    if (item) {
      item.quantity += quantity;
      await cart.save();
      res.status(200).json({
        success: true,
        data: cart,
        message: "Product quantity updated successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message:
        "Something went wrong while updating product quantity in the cart",
    });
  }
};

// @desc    Remove product from the cart of a specific table
// @route   DELETE /removeFromCart/:tableNumber/:productId
// @access  Public
const removeItemFromCart = async (req, res) => {
  // const { productId } = req.body;
  const productId = req.params.productId;
  console.log(productId);
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

    // Find the cart associated with the table
    const cart = await Cart.findOne({ _id: table.cart });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the product based on the provided product ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // Remove the product from the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== product._id.toString()
    );
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
      message: "Product removed from the cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while removing product from the cart",
    });
  }
};

// @desc    Clear the cart of a specific table
// @route   DELETE /clearCart/:tableNumber
// @access  Public
const clearCart = async (req, res) => {
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

    // Find the cart associated with the table
    const cart = await Cart.findOne({ _id: table.cart });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Clear the cart
    cart.items = [];
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while clearing the cart",
    });
  }
};

export {
  getAllCartItems,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  updateCartItemQuantity,
};
