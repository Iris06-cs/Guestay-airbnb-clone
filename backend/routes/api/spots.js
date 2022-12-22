// backend/routes/api/spots.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const {
  Spot,
  User,
  Review,
  SpotImage,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
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
//validate create review req body
const validateReviewBody = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .withMessage("Stars is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
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
//--------------Get all reviews by a spot id
router.get("/:spotId/reviews", async (req, res, next) => {
  const { spotId } = req.params;
  console.log(spotId);
  const spot = await Spot.findByPk(spotId);
  if (spot) {
    const reviewsData = await Review.findAll({
      where: {
        spotId,
      },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
      group: ["Review.id", "User.id", "ReviewImages.id"],
      order: ["id"],
    });
    const Reviews = [];
    reviewsData.forEach((review) => {
      Reviews.push(review.toJSON());
    });
    Reviews.forEach((review) => {
      review.createdAt = dateFormat(review.createdAt);
      review.updatedAt = dateFormat(review.updatedAt);
      if (!review.ReviewImages.length) review.ReviewImages = "No ReviewImages";
    });
    return res.json({ Reviews });
  } else {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found"];
    return next(err);
  }
});
//-------------create a Review for a spot based on the spot id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReviewBody,
  async (req, res, next) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const currentUserId = req.user.id;
    const spot = await Spot.findByPk(spotId);
    //check if spotId exists
    if (spot) {
      const reviews = await spot.getReviews();
      reviews.forEach((review) => {
        //check if current user already has a review for this spot
        if (review.userId === currentUserId) {
          const err = new Error("User already has a review for this spot");
          err.status = 403;
          err.title = "User already has a review for this spot";
          err.errors = ["User already has a review for this spot"];
          return next(err);
        }
        //check if current user is the spot owner
        if (spot.ownerId === currentUserId) {
          const err = new Error("Owner cannot review their own spot");
          err.status = 403;
          err.title = "Owner cannot review their own spot";
          err.errors = ["Owner cannot review their own spot"];
          return next(err);
        }
      });
      const newReview = await spot.createReview({
        userId: currentUserId,
        spotId,
        review,
        stars,
      });
      const resObj = newReview.toJSON();
      resObj.createdAt = dateFormat(newReview.createdAt);
      resObj.updatedAt = dateFormat(newReview.updatedAt);
      res.status(201);
      return res.json(resObj);
    } else {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found"];
      return next(err);
    }
  }
);
//--------------Get all bookings for a Spot based on the spotId
router.get(
  "/:spotIdForBooking/bookings",
  requireAuth,
  async (req, res, next) => {
    const { spotIdForBooking } = req.params;
    const currentUserId = req.user.id;
    //check if spot exit
    const spot = await Spot.findByPk(spotIdForBooking);
    if (spot) {
      if (spot.ownerId !== currentUserId) {
        //current user is not spot owner
        const Bookings = await Booking.findAll({
          where: {
            spotId: spotIdForBooking,
          },
          attributes: ["spotId", "startDate", "endDate"],
        });
        return res.json({ Bookings });
      } else {
        //current user is spot owner
        const bookingsData = await Booking.findAll({
          where: {
            spotId: spotIdForBooking,
          },
          include: { model: User, attributes: ["id", "firstName", "lastName"] },
          group: ["Spot.id", "User.id"],
        });
        let bookingDataFormat = [];
        let Bookings = [];
        bookingsData.forEach((booking) => {
          bookingDataFormat.push(booking.toJSON());
        });
        bookingDataFormat.forEach((booking) => {
          booking.createdAt = dateFormat(booking.createdAt);
          booking.updatedAt = dateFormat(booking.updatedAt);
          const {
            id,
            spotId,
            userId,
            startDate,
            endDate,
            createdAt,
            updatedAt,
            User,
          } = booking;
          const resBooking = {
            User,
            id,
            spotId,
            startDate,
            endDate,
            createdAt,
            updatedAt,
          };
          Bookings.push(resBooking);
        });

        return res.json({ Bookings });
      }
    } else {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found"];
      return next(err);
    }
  }
);
//-------------Create a booking for a spot base on spot id
const validateBookingBody = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("startDate is required")
    .isDate()
    .withMessage("not a valid date format YYYY-MM-DD"),
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("endDate is required")
    .isDate()
    .withMessage("not a valid date format YYYY-MM-DD"),
  handleValidationErrors,
];
router.post(
  "/:spotIdForBooking/bookings",
  requireAuth,
  validateBookingBody,
  async (req, res, next) => {
    const { spotIdForBooking } = req.params;
    const currentUserId = req.user.id;
    const { startDate, endDate } = req.body;
    if (new Date(startDate) >= new Date(endDate)) {
      const err = new Error("Validation error");
      err.status = 400;
      err.errors = ["endDate cannot be on or before startDate"];
      return next(err);
    }
    //check if spot exits
    const spot = await Spot.findByPk(spotIdForBooking);
    if (spot) {
      //check if current user is spot owner
      if (spot.ownerId !== currentUserId) {
        //get all existing bookings for this spot
        const existingBookings = await spot.getBookings();
        const bookings = [];
        existingBookings.forEach((booking) => {
          bookings.push(booking.toJSON());
        });
        for (let booking of bookings) {
          let start = new Date(booking.startDate);
          let end = new Date(booking.endDate);
          const reqStart = new Date(startDate);
          const reqEnd = new Date(endDate);
          if (reqStart <= end && reqStart >= start) {
            const err = new Error(
              "Sorry,this spot is already booked for the specified dates"
            );
            err.status = 403;
            err.title =
              "Sorry,this spot is already booked for the specified dates";
            err.errors = ["Start date conflicts with an existing booking"];
            next(err);
          } else if (reqEnd <= end && reqEnd >= start) {
            const err = new Error(
              "Sorry,this spot is already booked for the specified dates"
            );
            err.status = 403;
            err.title =
              "Sorry,this spot is already booked for the specified dates";
            err.errors = ["End date conflicts with an existing booking"];
            return next(err);
          }
        }
        const newBooking = await spot.createBooking({
          spotId: spotIdForBooking,
          userId: currentUserId,
          startDate,
          endDate,
        });
        const resObj = newBooking.toJSON();
        resObj.createdAt = dateFormat(newBooking.createdAt);
        resObj.updatedAt = dateFormat(newBooking.updatedAt);
        return res.json(resObj);
      } else {
        const err = new Error("Spot cannot belong to the current User");
        err.status = 403;
        err.title = "Spot cannot belong to the current User";
        err.errors = ["Spot cannot belong to the current User"];
        return next(err);
      }
    } else {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found"];
      return next(err);
    }
  }
);
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
  res.status(201);
  return res.json(resObj);
});

module.exports = router;
