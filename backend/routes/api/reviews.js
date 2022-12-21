// backend/routes/api/reviews.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const {
  Spot,
  User,
  Review,
  ReviewImage,
  SpotImage,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
const spot = require("../../db/models/spot");
const review = require("../../db/models/review");
const { dateFormat } = require("../../utils/dataFormatter");
//--------------Add an image to a review based on the review id
const validateReqBody = [
  check("url").exists({ checkFalsy: true }).withMessage("url is required"),
  handleValidationErrors,
];
router.post(
  "/:reviewId/images",
  requireAuth,
  validateReqBody,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const currentUserId = req.user.id;
    //check if review exits
    const review = await Review.findByPk(reviewId);
    if (review) {
      //check if review belongs to current user
      if (review.userId === currentUserId) {
        const images = await review.getReviewImages();
        if (images.length === 10) {
          const err = new Error(
            "Maximum number of images for this resource was reached"
          );
          err.status = 403;
          err.title = "Maximum number of images for this resource was reached";
          err.errors = [
            "Maximum number of images for this resource was reached",
          ];
          return next(err);
        } else {
          const newImage = await review.createReviewImage({ url });
          let resObj = {};
          resObj.id = newImage.id;
          resObj.url = newImage.url;
          return res.json(resObj);
        }
      } else {
        const err = new Error("Forbidden");
        err.status = 403;
        next(err);
      }
    } else {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      err.title = "Review couldn't be found";
      err.errors = ["Review couldn't be found with the provided review id"];
      return next(err);
    }
  }
);
//--------------Get all Reviews of the current user
router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const reviewsData = await Review.findAll({
    where: {
      userId,
    },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: { model: SpotImage, attributes: ["url", "preview"] },
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
    order: [["id"], ["userId"], ["spotId"]],
  });
  let Reviews = [];
  reviewsData.forEach((review) => {
    Reviews.push(review.toJSON());
  });
  Reviews.forEach((review) => {
    review.createdAt = dateFormat(review.createdAt);
    review.updatedAt = dateFormat(review.updatedAt);
    if (review.Spot.SpotImages.length) {
      review.Spot.SpotImages.forEach((image) => {
        if (image.preview === true) {
          review.Spot.previewImage = image.url;
        }
      });
    } else review.Spot.previewImage = "Does not have a preview image";
    if (!review.ReviewImages.length)
      review.ReviewImages = "Does not have any review images";
    delete review.Spot.SpotImages;
  });
  return res.json({ Reviews });
});
module.exports = router;
