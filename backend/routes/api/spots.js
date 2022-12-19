// backend/routes/api/spots.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
//Get all spots owned by the current user

//Get all spots
router.get("/", async (req, res, next) => {
  const spots = [];
  const spotsData = await Spot.findAll();
  for (let spot of spotsData) {
    const reviewData = await spot.getReviews({
      group: "spotId",
      attributes: {
        include: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
      },
    });
    const previewImage = await SpotImage.findOne({
      attributes: ["url"],
      where: {
        spotId: spot.id,
        preview: true,
      },
    });
    const spotData = spot.toJSON();
    spotData.avgRating = reviewData[0].toJSON().avgRating;
    spotData.previewImage = previewImage.url;
    spots.push(spotData);
  }
  res.json({ spots });
});

module.exports = router;

// SELECT `Spot`.`id`, `Spot`.`ownerId`, `Spot`.`address`, `Spot`.`city`, `Spot`.`state`, `Spot`.`country`, `Spot`.`lat`, `Spot`.`lng`, `Spot`.`name`, `Spot`.`description`, `Spot`.`price`, `Spot`.`createdAt`, `Spot`.`updatedAt`, `Reviews`.`id` AS `Reviews.id`, AVG(`stars`) AS `Reviews.avgRating` FROM `Spots` AS `Spot` LEFT OUTER JOIN `Reviews` AS `Reviews` ON `Spot`.`id` = `Reviews`.`spotId`;
