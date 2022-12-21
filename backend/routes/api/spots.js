// backend/routes/api/spots.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { dateFormat } = require("../../utils/dataFormatter");
const { Op } = require("sequelize");
const spot = require("../../db/models/spot");
//validate req body
const validateSpotBody = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];
//-------------Add an image to a spot based on the spot id
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  const currentUserId = req.user.id;
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (spot) {
    //check spot belongs to current user
    if (currentUserId === spot.ownerId) {
      const newImage = await spot.createSpotImage({
        url,
        preview,
      });
      let resObj = {};
      resObj.id = newImage.id;
      resObj.url = newImage.url;
      resObj.preview = newImage.preview;
      return res.json(resObj);
    }
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  } else {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found"];
    return next(err);
  }
});
//-------------Get all spots owned by the current user
router.get("/current", requireAuth, async (req, res, next) => {
  let Spots = [];
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
    order: [["id"]],
  });
  spotsData.forEach((spotData) => {
    Spots.push(spotData.toJSON());
  });

  Spots.forEach((spot) => {
    spot.SpotImages.forEach((spotImage) => {
      if (spotImage.preview === true) spot.previewImage = spotImage.url;
    });
    spot.createdAt = dateFormat(spot.createdAt);
    spot.updatedAt = dateFormat(spot.updatedAt);
    if (!spot.previewImage) spot.previewImage = "Spot has no image yet";
    if (!spot.avgRating) spot.avgRating = "Spot has no review yet";
    delete spot.SpotImages;
  });
  if (!Spots.length) Spots = "No spots created under current user";
  res.json({ Spots });
});
//-----------------Get details of a spot from an id
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
    group: ["Spot.id", "Owner.id", "SpotImages.id"],
  });

  if (spot) {
    let resObj = spot.toJSON();
    resObj.createdAt = dateFormat(spot.createdAt);
    resObj.updatedAt = dateFormat(spot.updatedAt);
    if (resObj.numReviews === 0)
      resObj.avgStarRating = "Spot has no review yet";
    if (!resObj.SpotImages.length) resObj.SpotImages = "Spot has no image yet";
    return res.json(resObj);
  } else {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found with the provided spot id"];
    return next(err);
  }
});
//-------------------Edit a spot
router.put(
  "/:spotId",
  requireAuth,
  validateSpotBody,
  async (req, res, next) => {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    const { spotId } = req.params;
    const ownerId = req.user.id;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
      //check spot belongs to current user
      if (ownerId === spot.ownerId) {
        await spot.update({
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price,
        });
        await spot.save();
        let resObj = spot.toJSON();
        resObj.createdAt = dateFormat(spot.createdAt);
        resObj.updatedAt = dateFormat(spot.updatedAt);
        res.status(201);
        return res.json(resObj);
      }
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    } else {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found with the provided spot id"];
      return next(err);
    }
  }
);
//------------------Delete a spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const ownerId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (spot) {
    //check spot belongs to current user
    if (ownerId === spot.ownerId) {
      await spot.destroy();
      return res.json({ message: "Successfully deleted", statusCode: 200 });
    }
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  } else {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found with the provided spot id"];
    return next(err);
  }
});
//------------------Get all spots
router.get("/", async (req, res, next) => {
  let Spots = [];
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
    order: [["id"]],
  });
  spotsData.forEach((spotData) => {
    Spots.push(spotData.toJSON());
  });
  Spots.forEach((spot) => {
    spot.SpotImages.forEach((spotImage) => {
      if (spotImage.preview === true) spot.previewImage = spotImage.url;
    });
    spot.createdAt = dateFormat(spot.createdAt);
    spot.updatedAt = dateFormat(spot.updatedAt);
    if (!spot.previewImage) spot.previewImage = "Spot has no image yet";
    if (!spot.avgRating) spot.avgRating = "Spot has no review yet";
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
  res.json({ Spots });
});

//-------------------create a spot under current loggin in user
router.post("/", requireAuth, validateSpotBody, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  //check if address exists
  const checkAddress = await Spot.findOne({
    where: { address },
  });
  if (checkAddress) {
    const err = new Error("Address already exists");
    err.status = 400;
    err.title = "Address already exists";
    err.errors = ["Spot with this address already exists"];
    return next(err);
  }

  const ownerId = req.user.id;
  const newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  let resObj = newSpot.toJSON();
  resObj.createdAt = dateFormat(newSpot.createdAt);
  resObj.updatedAt = dateFormat(newSpot.updatedAt);
  res.status = 201;
  return res.json(resObj);
});

module.exports = router;
