import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  caption: String,
  img: String,
  price: Number,
  quantity: Number,
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
