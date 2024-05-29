import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Token from "../models/tokenModel.js";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import {
  uploadImage,
  deleteImage,
} from "../middlewares/cloudinaryMiddleware.js";

// @desc      SignUp a user
// @route     POST /users/signup
// @access    Public // VERIFIED
const signupHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (validator.isEmail(email) === false) {
      return res.status(400).json({
        message: "Invalid Email",
        success: false,
      });
    }
    // check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "An email has been sent on your email please verify",
        success: false,
      });
    }
    let hashedPassword = "";
    if (password.length >= 6) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const newUser = await user.save();
    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.CLIENT}/users/${newUser._id}/verify/${token.token}`;
    await mailSender(
      newUser.email,
      "To complete your registration, please verify your email address by clicking the button below:",
      url,
      "Verify Email"
    );

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong while creating the user.",
      success: false,
    });
  }
};

// @desc      Verify user
// @route     GET /users/:id/verify/:token
// @access    Public  // VERIFIED
const verifyToken = async (req, res) => {
  try {
    // console.log(req.params.id);
    // console.log(req.params.token);
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({
        message: "User doesn't found",
        success: false,
      });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    // console.log(token);
    if (!token) {
      return res.status(400).send({
        message: "Token doesn't exist",
        success: false,
      });
    }

    await User.updateOne({ _id: user._id }, { $set: { verified: true } });
    await Token.deleteOne({ userId: user._id });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error Token not verified",
      success: false,
      error: error.message,
    });
  }
};
// @desc      Login user
// @route     POST /users/login
// @access    Public  // VERIFIED
const signinHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
        success: false,
      });
    }
    // Sending Email if User not verified
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return res.status(400).send({
        message: "An Email sent to your account please verify",
        success: false,
      });
    }
    // generate cookie using JWT
    const token = createToken({ id: user._id, role: user.role });
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .status(200)
      .json({
        message: "User signed in successfully",
        success: true,
        token,
      });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "something went wrong during signin",
    });
  }
};

// @desc      Logout user
// @route     POST /users/logout
// @access    Public  // VERIFIED
const logoutHandler = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 }).status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (err) {
    res.status(400).json({ error: "Error while logging out", success: false });
  }
};

const maxAge = 3 * 24 * 60 * 60;
// Function to create a JWT token
const createToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

// @desc      Get user profile
// @route     GET /users/profile
// @access    Private
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // populate orders and carts
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // console.log(user.image);

    res.status(200).json({
      message: "User found successfully",
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message,
    });
  }
};

// @desc      Update user profile image
// @route     PUT /users/profile
// @access    Private
const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // check if image already exist if exist delete that image
    if (user.image) {
      await deleteImage(user.image);
    }
    // Call the uploadImage middleware with async/await
    await uploadImage(req, res);

    // Check if the upload was successful
    const uploadResult = res.locals.uploadResult;
    const imageUrl = uploadResult.imageUrl;
    // console.log(imageUrl);

    user.image = imageUrl;
    await user.save();

    res.status(200).json({
      message: "User profile image updated successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while updating user profile image",
      success: false,
      error: err.message,
    });
  }
};

// @desc      Forgot password
// @route     POST /users/forgot-password
// @access    Public  // VERIFIED
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // Check if a reset token already exists for the user
    const existingToken = await Token.findOne({ userId: user._id });

    if (existingToken) {
      return res.status(409).json({
        message: "An Email is Already been sent to reset the password",
        success: false,
      });
    }
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}users/${user.id}/reset-password/${token.token}`;
    await mailSender(
      user.email,
      "Reset Password",
      "Please click the button below to Reset Password.",
      url
    );
    res.status(200).json({
      message: "Password reset link sent to your email",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error ocuured during sending mail to reset the password",
      success: false,
      error: err.message,
    });
  }
};

// @desc      Reset password
// @route     POST /users/:id/reset-password/:token
// @access    Public  // VERIFIED
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({
        message: "Token doesn't exist",
        success: false,
      });
    }
    let hashedPassword = "";
    if (password.length >= 6) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    await Token.deleteOne({ userId: user._id });
    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Error occur during resetting the password",
      success: false,
      error: error.message,
    });
  }
};

// @desc    delete user
// @route   DELETE /users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // Call the deleteImage middleware if image exist on cloudinary
    if (user.image) {
      await deleteImage(user.image);
    }
    // delete token if it exist
    const token = await Token.findOne({ userId: user._id });
    if (token) {
      await Token.deleteOne({ userId: user._id });
    }
    // delete all orders of user
    await Order.deleteMany({ userId: user._id });

    await user.deleteOne();
    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong during deleting an user",
      success: false,
      error: error.message,
    });
  }
};
export {
  signupHandler,
  signinHandler,
  logoutHandler,
  verifyToken,
  getProfile,
  updateProfileImage,
  forgotPassword,
  resetPassword,
  deleteUser,
};
