import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["free", "reserved"],
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  qrCode: {
    type: String,
    unique: true,
    required: true,
  },
});

const Table = mongoose.model("Table", tableSchema);

export default Table;
