import Product from "../models/productModel.js";
import {
  uploadImage,
  deleteImage,
} from "../middlewares/cloudinaryMiddleware.js";

// @desc    Fetch all products
// @route   GET /products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all the products",
      error: error.message,
    });
  }
};

// @desc    Fetch a single product
// @route   GET /products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
      message: "Product fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the product",
      error: error.message,
    });
  }
};

// @desc    Fetch special products
// @route   GET /products/special
// @access  Public
const getSpecialProducts = async (req, res) => {
  try {
    const products = await Product.find({ special: true });
    // console.log(products);
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Special Products",
      });
    }
    res.status(200).json({
      success: true,
      data: products,
      message: "Special products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the special products",
      error: error.message,
    });
  }
};

// @desc    Fetch products by category
// @route   GET /products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the products",
      error: error.message,
    });
  }
};

// @desc    Fetch products by type
// @route   GET /products/type/:type
// @access  Public
const getProductsByType = async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type });
    res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the products",
      error: error.message,
    });
  }
};

// @desc    Create a new product
// @route   POST /products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const {
      category,
      type,
      caption,
      description,
      special,
      price,
      rating,
      quantity,
    } = req.body;
    // Call the uploadImage middleware with async/await
    await uploadImage(req, res);

    // Check if the upload was successful
    const uploadResult = res.locals.uploadResult;
    const imageUrl = uploadResult.imageUrl;
    // console.log(imageUrl);

    // Create a new product object with the uploaded image URL and other product details
    const product = new Product({
      category,
      type,
      image: imageUrl,
      caption,
      description,
      special,
      price,
      rating,
      quantity,
    });
    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product",
      error: error.message,
    });
  }
};

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // Check if a new image file is provided in the request
    const newImageFile = req.files?.image;
    if (newImageFile) {
      // Call the deleteImage middleware with async/await
      await deleteImage(product.image);
      // Call the uploadImage middleware with async/await
      await uploadImage(req, res);
      // Check if the upload was successful
      const uploadResult = res.locals.uploadResult;
      // Save the Cloudinary image URL to the updated product
      req.body.image = uploadResult.imageUrl;
    }
    // Update the product with the new data
    const updatedProductData = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      data: updatedProductData,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the product",
      error: error.message,
    });
  }
};

// @desc    Delete a product by id
// @route   DELETE /products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // Call the deleteImage middleware with async/await
    await deleteImage(product.image);
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the product",
      error: error.message,
    });
  }
};

export {
  getAllProducts,
  getProduct,
  getSpecialProducts,
  getProductsByCategory,
  getProductsByType,
  createProduct,
  updateProduct,
  deleteProduct,
};
