import Feedback from "../models/feedbackModel.js";
import {
  uploadImage,
  deleteImage,
} from "../middlewares/cloudinaryMiddleware.js";

// @desc    give feedback
// @route   PUT /feedbacks
// @access  Public
const giveFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    // if feedback exist for a particular user
    const existingFeedback = await Feedback.findOne({ user: userId });
    if (existingFeedback) {
      return res.status(400).json({
        message: "Feedback already given",
        success: false,
      });
    }
    const { name, rating, comments } = req.body;
    // Call the uploadImage middleware with async/await
    await uploadImage(req, res);
    // Check if the upload was successful
    const uploadResult = res.locals.uploadResult;
    const imageUrl = uploadResult.imageUrl;
    // console.log(imageUrl);

    const feedback = new Feedback({
      user: userId,
      name,
      image: imageUrl,
      rating,
      comments,
    });
    await feedback.save();
    res.status(200).json({
      message: "Feedback given successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while giving feedback",
      error: error.message,
      success: false,
    });
  }
};

// @desc    get All feedbacks
// @route   GET /feedbacks/all
// @access  Public
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    if (!feedbacks) {
      return res.status(404).json({
        message: "No feedbacks found",
        success: false,
      });
    }
    // reverse all the feedbacks to show the latest feedback first
    feedbacks.reverse();
    res.status(200).json({
      message: "All feedbacks fetched successfully",
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching feedbacks",
      error: error.message,
      success: false,
    });
  }
};
// @desc    get a particular feedback
// @route   GET /feedbacks/:id
// @access  Public
const getFeedback = async (req, res) => {
  try {
    // find feedback for a particular user
    const feedback = await Feedback.findOne({ user: req.params.id });

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Feedback fetched successfully",
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching feedback",
      error: error.message,
      success: false,
    });
  }
};

// @desc    update a particular feedback
// @route   PUT /feedbacks/:id
// @access  Public
const updateFeedback = async (req, res) => {
  try {
    // find feedback for a particular user
    const feedback = await Feedback.findOne({ user: req.user.id });
    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
        success: false,
      });
    }
    // Check if a new image file is provided in the request
    const newImageFile = req.files?.image;
    if (newImageFile) {
      // Call the deleteImage middleware with async/await
      await deleteImage(feedback.image);
      // Call the uploadImage middleware with async/await
      await uploadImage(req, res);
      // Check if the upload was successful
      const uploadResult = res.locals.uploadResult;
      req.body.image = uploadResult.imageUrl;
    } else {
      req.body.image = feedback.image;
    }
    // Update the feedback with the new data
    const updatedFeedback = await Feedback.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Feedback updated successfully",
      success: true,
      data: updatedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating feedback",
      error: error.message,
      success: false,
    });
  }
};

// @desc    delete a particular feedback
// @route   DELETE /feedbacks/:id
// @access  Public
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ user: req.user.id });
    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
        success: false,
      });
    }
    // Call the deleteImage middleware with async/await
    await deleteImage(feedback.image);
    await feedback.deleteOne();
    res.status(200).json({
      message: "Feedback deleted successfully",
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleting feedback",
      error: error.message,
      success: false,
    });
  }
};

export {
  giveFeedback,
  getAllFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
