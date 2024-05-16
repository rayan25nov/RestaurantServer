import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpaySignature: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "failure"],
  },
  amount: {
    type: Number,
    required: true,
  },
  orderIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", paymentSchema);
