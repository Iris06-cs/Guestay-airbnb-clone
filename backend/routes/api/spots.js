// backend/routes/api/spots.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

//Get all spots owned by the current user
router.get("/current", requireAuth, async (req, res, next) => {
  const spots = [];
  const userId = req.user.id;
  const spotsData = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    include: [{ model: Review, attributes: [] }, { model: SpotImage }],
    attributes: {
      include: [
        [
          sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
          "avgRating",
        ],
      ],
    },
    group: ["SpotImages.id", "Spot.id"],
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
  });

  res.json({ spots });
});
//Get details of a spot from an id
router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId, {
    include: [
      { model: Review, attributes: [] },
      { model: SpotImage, attributes: ["id", "url", "preview"] },
      { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
    ],
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("stars")), "numReviews"],
        [
          sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
          "avgStarRating",
        ],
      ],
    },
    group: ["Spot.id", "SpotImages.id"],
  });
  if (spot.id !== null) {
    if (spot.numReviews === 0) spot.avgStarRating = "No Review";
    if (!spot.SpotImages.length) spot.SpotImages = "No Image";
    return res.json(spot);
  } else {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found with the provided spot id"];
    return next(err);
  }
});
//Get all spots
router.get("/", async (req, res, next) => {
  const spots = [];
  const spotsData = await Spot.findAll({
    // subQuery: false,
    include: [{ model: Review, attributes: [] }, { model: SpotImage }],
    attributes: {
      include: [
        [
          sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
          "avgRating",
        ],
      ],
    },
    group: ["SpotImages.id", "Spot.id"],
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
// Executing (default):
// SELECT `Spot`.`id`, `Spot`.`ownerId`, `Spot`.`address`, `Spot`.`city`, `Spot`.`state`, `Spot`.`country`, `Spot`.`lat`, `Spot`.`lng`, `Spot`.`name`, `Spot`.`description`, `Spot`.`price`, `Spot`.`createdAt`, `Spot`.`updatedAt`, COUNT(`stars`) AS `numReviews`, ROUND(AVG(`stars`), 1) AS `avgStarRating`, `SpotImages`.`id` AS `SpotImages.id`, `SpotImages`.`url` AS `SpotImages.url`, `SpotImages`.`preview` AS `SpotImages.preview`, `Owner`.`id` AS `Owner.id`, `Owner`.`firstName` AS `Owner.firstName`, `Owner`.`lastName` AS `Owner.lastName`
// FROM `Spots` AS `Spot`
// LEFT OUTER JOIN `Reviews` AS `Reviews`
// ON `Spot`.`id` = `Reviews`.`spotId`
// LEFT OUTER JOIN `SpotImages` AS `SpotImages`
// ON `Spot`.`id` = `SpotImages`.`spotId`
// LEFT OUTER JOIN `Users` AS `Owner`
// ON `Spot`.`ownerId` = `Owner`.`id`
// WHERE `Spot`.`id` = '3'
// GROUP BY `Spot`.`id`, `Owner`.`id`, `SpotImages`.`id`;
