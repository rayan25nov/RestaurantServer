import Razorpay from "razorpay";
import Payment from "../models/paymentModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getRazorpayKey = async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

const capturePayment = async (req, res) => {
  const userId = req.user?.id;
  try {
    const { amount, currency, orders } = req.body;
    const options = { amount, currency };
    // OrdersId of the orders
    const ordersId = orders.map((order) => order._id);
    // console.log(ordersId);
    // check if payment already exists for the order
    const existingPayment = await Payment.findOne({
      orderIds: { $in: ordersId },
    });
    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: "Payment already captured for the order",
      });
    }
    // console.log("options", options);
    const paymentResponse = await razorpay.orders.create(options);
    const payment = new Payment({
      razorpayPaymentId: paymentResponse.id,
      razorpayOrderId: paymentResponse.id,
      status: "pending",
      amount: paymentResponse.amount,
      // find all order ids
      orderIds: [ordersId],
    });

    await payment.save();
    const user = await User.findById(userId);
    res.json({ success: true, data: paymentResponse, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to capture payment",
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  const { data } = req.body;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
  // console.log(data);
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: `Payment not found for order ID: ${razorpay_order_id}`,
    });
  }

  if (isAuthentic) {
    payment.status = "success";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpayOrderId = razorpay_order_id;
    payment.razorpaySignature = razorpay_signature;
    payment.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } else {
    payment.status = "failed";
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export { capturePayment, verifyPayment, getRazorpayKey };
