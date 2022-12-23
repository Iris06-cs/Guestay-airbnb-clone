// backend/routes/api/review-images.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const { Review, ReviewImage, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { dateFormat } = require("../../utils/dataFormatter");
const { Op } = require("sequelize");

//--------------Delete a review image
router.delete("/:reviewImageId", requireAuth, async (req, res, next) => {
  const { reviewImageId } = req.params;
  const currentUserId = req.user.id;
  const image = await ReviewImage.findByPk(reviewImageId, {
    include: { model: Review, attributes: ["userId"] },
    group: ["ReviewImage.id", "Review.id"],
  });

  //spotImage does not exit
  if (!image) {
    const err = new Error("Spot Image couldn't be found");
    err.status = 404;
    err.title = "Spot Image couldn't be found";
    err.errors = ["Spot Image couldn't be found"];
    return next(err);
  }
  const reviewUserId = image.Review.userId;
  //spot does not belong to current user
  if (currentUserId !== reviewUserId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
  await image.destroy();
  return res.json({ message: "Successfully deleted", statusCode: 200 });
});
module.exports = router;
