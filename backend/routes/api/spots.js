// backend/routes/api/spots.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

//Get details of a spot from an id
router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;
  console.log(req.params);
  const spot = await Spot.findByPk(spotId);
  res.json(spot);
});

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

  res.json({ spots });
});

//Get all spots
router.get("/", async (req, res, next) => {
  const spots = [];
  const spotsData = await Spot.findAll({
    // subQuery: false,
    include: [{ model: Review, attributes: [] }, { model: SpotImage }],
    attributes: {
      include: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
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
