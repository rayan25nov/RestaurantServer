import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["mainDish", "breakFast", "desserts"],
  },
  type: {
    type: String,
    required: true,
    enum: ["veg", "nonVeg"],
  },
  img: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
