const Review = require("../models/Review");
const Product = require("../models/Product");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

/*************************************************************
 *
 * CREATE REVIEW
 */
const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

/*****************************************************************************
 *
 * Get All Reviews
 * populate method get info specific
 * must have  ref: "User" in model
 */
const getAllReviews = async (req, res) => {
  //   const reviews = await Review.find({});

  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  }).populate({
    path: "user",
    select: "name email password",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

/**********************************************************************************
 *
 * get Single Review
 */
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

/****************************************************************************************
 *
 * Update Review
 */
const updateReview = async (req, res) => {
  res.send("updateReview");
};

/***************************************************************************************
 * 
 * DELETE REVIEW
 */
const deleteReview = async (req, res) => {
  res.send("deleteReview");
};

/**************************************************************************************
 * 
 * Get Single Product Review
 */
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

/************************************************************************************
 * 
 * EXPORTS
 */
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
