// backend/routes/api/spot-images.js
const express = require("express");
const router = express.Router();
const { requireAuth, forbidden } = require("../../utils/auth");
const { SpotImage, Spot } = require("../../db/models");
//-----------Delete a spot image
router.delete("/:spotImageId", requireAuth, async (req, res, next) => {
  const { spotImageId } = req.params;
  const currentUserId = req.user.id;
  const image = await SpotImage.findByPk(spotImageId, {
    include: { model: Spot, attributes: ["ownerId"] },
    group: ["SpotImage.id", "Spot.id"],
  });
  //spotImage does not exit
  if (!image) {
    const err = new Error("Spot Image couldn't be found");
    err.status = 404;
    err.title = "Spot Image couldn't be found";
    err.errors = ["Spot Image couldn't be found"];
    return next(err);
  }
  const spotOwnerId = image.Spot.ownerId;
  //spot does not belong to current user
  if (currentUserId !== spotOwnerId) {
    forbidden(req, res, next);
  }
  await image.destroy();
  return res.json({ message: "Successfully deleted", statusCode: 200 });
});
module.exports = router;
