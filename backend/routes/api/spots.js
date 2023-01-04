// backend/routes/api/spots.js
const express = require("express");
const router = express.Router();
const { requireAuth, forbidden } = require("../../utils/auth");
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

//-------------Add an image to a spot based on the spot id
//add request body validation
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  const currentUserId = req.user.id;
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  //check if spot exist
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found"];
    return next(err);
  }
  //check spot belongs to current user
  if (currentUserId !== spot.ownerId) {
    forbidden(req, res, next);
    return;
  }
  const newImage = await spot.createSpotImage({
    url,
    preview,
  });
  let resObj = {};
  resObj.id = newImage.id;
  resObj.url = newImage.url;
  resObj.preview = newImage.preview;
  return res.json(resObj);
});
//--------------Get all reviews by a spot id
router.get("/:spotId/reviews", async (req, res, next) => {
  const { spotId } = req.params;
  console.log(spotId);
  const spot = await Spot.findByPk(spotId);
  //check if spot exist
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found"];
    return next(err);
  }
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
});
//-------------create a Review for a spot based on the spot id
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
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found"];
      return next(err);
    }
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
    });
    //check if current user is the spot owner?
    if (spot.ownerId === currentUserId) {
      const err = new Error("Owner cannot review their own spot");
      err.status = 403;
      err.title = "Owner cannot review their own spot";
      err.errors = ["Owner cannot review their own spot"];
      return next(err);
    }
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
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found"];
      return next(err);
    }
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
        group: ["Booking.id", "User.id"],
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
          userId,
          startDate,
          endDate,
          createdAt,
          updatedAt,
        };
        Bookings.push(resBooking);
      });
      return res.json({ Bookings });
    }
  }
);
//-------------Create a booking for a spot base on spot id
const validateBookingBody = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("startDate is required")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("not a valid date format YYYY-MM-DD"),
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("endDate is required")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
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
    const reqStart = new Date(startDate);
    const reqEnd = new Date(endDate);
    //check if end date is before start date
    if (reqStart >= reqEnd) {
      const err = new Error("Validation error");
      err.status = 400;
      err.errors = ["endDate cannot be on or before startDate"];
      return next(err);
    }
    //check if spot exits
    const spot = await Spot.findByPk(spotIdForBooking);
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found"];
      return next(err);
    }
    //check if current user is spot owner
    if (spot.ownerId === currentUserId) {
      //spot cannot belong to the current User
      forbidden(req, res, next);
      return;
    }
    //get all existing bookings for this spot
    const existingBookings = await spot.getBookings();
    const bookings = [];
    existingBookings.forEach((booking) => {
      bookings.push(booking.toJSON());
    });
    //check booking date conflict
    let confilctError = {
      message: "Sorry,this spot is already booked for the specified dates",
      statusCode: 403,
      title: "Sorry,this spot is already booked for the specified dates",
      errors: [],
    };
    for (let booking of bookings) {
      let start = new Date(booking.startDate);
      let end = new Date(booking.endDate);
      if (reqStart <= end && reqStart >= start) {
        confilctError.errors.push(
          "Start date conflicts with an existing booking"
        );
      }
      if (reqEnd <= end && reqEnd >= start) {
        confilctError.errors.push(
          "End date conflicts with an existing booking"
        );
      }
    }
    if (confilctError.errors.length) {
      res.status(403);
      res.json(confilctError);
      return;
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
    //check if spot exist
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.title = "Spot couldn't be found";
      err.errors = ["Spot couldn't be found with the provided spot id"];
      return next(err);
    }
    //check spot belongs to current user
    if (ownerId !== spot.ownerId) {
      forbidden(req, res, next);
      return;
    }
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
    res.status(200);
    return res.json(resObj);
  }
);
//------------------Delete a spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const ownerId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot couldn't be found";
    err.errors = ["Spot couldn't be found with the provided spot id"];
    return next(err);
  }
  //check spot belongs to current user
  if (ownerId !== spot.ownerId) {
    forbidden(req, res, next);
    return;
  }
  await spot.destroy();
  return res.json({ message: "Successfully deleted", statusCode: 200 });
});
//------------------Get all spots(with query)
router.get("/", async (req, res, next) => {
  let errorResponse = {
    message: "Validation Error",
    statusCode: 400,
    errors: [],
  };
  let Spots = [];
  let query = { where: {} };
  //parse query parmeters from string to number
  const queryParms = Object.keys(req.query);
  queryParms.forEach((key) => {
    if (key === "page" || key === "size")
      req.query[key] = parseInt(req.query[key]);
    else req.query[key] = parseFloat(req.query[key]);
  });
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  if (minLat) {
    if (minLat < -90 || minLat > 90)
      errorResponse.errors.push("Minimum latitude is invalid");
    else query.where.lat = { [Op.gte]: minLat };
  }
  if (maxLat) {
    if (maxLat > 90 || maxLat < -90)
      errorResponse.errors.push("Maximum latitude is invalid");
    else if (minLat) query.where.lat = { [Op.between]: [minLat, maxLat] };
    else query.where.lat = { [Op.lte]: maxLat };
  }
  if (minLng) {
    if (minLng < -180 || minLng > 180)
      errorResponse.errors.push("Minimum longitude is invalid");
    else query.where.lng = { [Op.gte]: minLng };
  }
  if (maxLng) {
    if (maxLng > 180 || maxLng < -180)
      errorResponse.errors.push("Maximum latitude is invalid");
    else if (minLat) query.where.lng = { [Op.between]: [minLng, maxLng] };
    else query.where.lng = { [Op.lte]: maxLng };
  }
  if (minPrice) {
    if (minPrice < 0)
      errorResponse.errors.push(
        "Minimum price must be greater than or equal to 0"
      );
    else query.where.price = { [Op.gte]: minPrice };
  }
  if (maxPrice) {
    if (maxPrice < 0)
      errorResponse.errors.push(
        "Maximum price must be greater than or equal to 0"
      );
    else if (minPrice)
      query.where.price = { [Op.between]: [minPrice, maxPrice] };
    else query.where.price = { [Op.lte]: maxPrice };
  }
  //pagination
  if (!page) page = 0;
  if (!size) size = 20;
  let pagination = {};
  //check size
  if (Number.isInteger(size) && size >= 0 && size <= 20) {
    if (size !== 0) pagination.limit = size;
  } else {
    errorResponse.errors.push("Size must be greater than or equal to 0");
  }
  //check page
  if (Number.isInteger(page) && page >= 0 && page <= 10) {
    if (page !== 0) pagination.offset = size * (page - 1);
  } else {
    errorResponse.errors.push("Page must be greater than or equal to 0");
  }
  //query parameter validation errors
  if (errorResponse.errors.length) {
    res.status(400);
    res.json(errorResponse);
    return;
  }
  const spotsData = await Spot.findAll({
    include: [{ model: Review, attributes: [] }, { model: SpotImage }],
    attributes: {
      include: [
        [
          sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
          "avgRating",
        ],
      ],
    },
    ...query,
    group: ["SpotImages.id", "Spot.id"],
    order: [["id"]],
    pagination,
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
  if (!Spots.length) Spots = "No matching spots";
  //if page size not in query parmas,response with no size page
  if (!req.query.page && !req.query.size) {
    resObj = { Spots };
  } else if (!(page === 0 && size === 0)) {
    resObj = { Spots, page, size };
  } else {
    resObj = { Spots };
  }

  return res.json(resObj);
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
