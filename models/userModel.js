import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Minimum password length is 6 character"],
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
