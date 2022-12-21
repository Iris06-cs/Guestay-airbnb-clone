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
