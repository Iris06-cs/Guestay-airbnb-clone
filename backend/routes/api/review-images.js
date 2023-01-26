// backend/routes/api/review-images.js
const express = require("express");
const router = express.Router();
const { requireAuth, forbidden } = require("../../utils/auth");
const { Review, ReviewImage } = require("../../db/models");
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
    const err = new Error("Review Image couldn't be found");
    err.status = 404;
    err.title = "Review Image couldn't be found";
    err.errors = ["Review Image couldn't be found"];
    return next(err);
  }
  const reviewUserId = image.Review.userId;
  //spot does not belong to current user
  if (currentUserId !== reviewUserId) {
    forbidden(req, res, next);
  }
  await image.destroy();
  return res.json({ message: "Successfully deleted", statusCode: 200 });
});
module.exports = router;
