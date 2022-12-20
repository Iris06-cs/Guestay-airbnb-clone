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
  const spotsData = await Spot.findAll({
    subQuery: false,
    include: [{ model: Review, attributes: [] }, { model: SpotImage }],
    attributes: {
      include: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
    },
    group: ["Spot.id"],
  });
  spotsData.forEach((spotData) => {
    spots.push(spotData.toJSON());
  });
  spots.forEach((spot) => {
    spot.SpotImages.forEach((spotImage) => {
      if (spotImage.preview === true) spot.previewImage = spotImage.url;
    });
    if (!spot.previewImage) spot.previewImage = "no image";
    delete spot.SpotImages;
    delete spot.Reviews;
  });
  // for (let spot of spotsData) {
  //   const reviewData = await spot.getReviews({
  //     attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
  //     group: ["Review.id"],
  //   });
  //   const previewImage = await SpotImage.findOne({
  //     attributes: ["url"],
  //     where: {
  //       spotId: spot.id,
  //       preview: true,
  //     },
  //   });
  // const spotData = spot.toJSON();
  // spotData.avgRating = reviewData[0].toJSON().avgRating;
  //   spotData.previewImage = previewImage.toJSON().url;
  //   spots.push(spotData);
  // }
  res.json({ spots });
});

module.exports = router;

// SELECT `Spot`.`id`, `Spot`.`ownerId`, `Spot`.`address`, `Spot`.`city`, `Spot`.`state`, `Spot`.`country`, `Spot`.`lat`, `Spot`.`lng`, `Spot`.`name`, `Spot`.`description`, `Spot`.`price`, `Spot`.`createdAt`, `Spot`.`updatedAt`, `Reviews`.`id` AS `Reviews.id`, `Reviews`.`userId` AS `Reviews.userId`, `Reviews`.`spotId` AS `Reviews.spotId`, `Reviews`.`review` AS `Reviews.review`, `Reviews`.`stars` AS `Reviews.stars`, `Reviews`.`createdAt` AS `Reviews.createdAt`, `Reviews`.`updatedAt` AS `Reviews.updatedAt`, AVG(`stars`) AS `Reviews.avgRating`, `SpotImages`.`id` AS `SpotImages.id`, `SpotImages`.`url` AS `SpotImages.url`, `SpotImages`.`preview` AS `SpotImages.preview`, `SpotImages`.`spotId` AS `SpotImages.spotId`, `SpotImages`.`createdAt` AS `SpotImages.createdAt`, `SpotImages`.`updatedAt` AS `SpotImages.updatedAt`
// FROM `Spots` AS `Spot`
// LEFT OUTER JOIN `Reviews` AS `Reviews`
// ON `Spot`.`id` = `Reviews`.`spotId`
// LEFT OUTER JOIN `SpotImages` AS `SpotImages` ON `Spot`.`id` = `SpotImages`.`spotId`;
