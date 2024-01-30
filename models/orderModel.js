import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  totalMoney: Number,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
