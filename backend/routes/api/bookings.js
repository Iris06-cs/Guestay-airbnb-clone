// backend/routes/api/bookings.js
const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const {
  Booking,
  Spot,
  User,
  Review,
  ReviewImage,
  SpotImage,
  sequelize,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
// const spot = require("../../db/models/spot");
// const review = require("../../db/models/review");
const { dateFormat } = require("../../utils/dataFormatter");

//----------------get all bookings of current user
router.get("/current", requireAuth, async (req, res, next) => {
  const currentUserId = req.user.id;
  const bookingsData = await Booking.findAll({
    where: { userId: currentUserId },
    include: {
      model: Spot,
      attributes: { exclude: ["createdAt", "updatedAt", "description"] },
      include: { model: SpotImage, attributes: ["url", "preview"] },
    },
    group: ["Booking.id", "Spot.id", "Spot->SpotImages.id"],
    order: [["id"]],
  });
  let bookingDataFormat = [];
  let Bookings = [];
  bookingsData.forEach((booking) => {
    bookingDataFormat.push(booking.toJSON());
  });
  bookingDataFormat.forEach((booking) => {
    booking.createdAt = dateFormat(booking.createdAt);
    booking.updatedAt = dateFormat(booking.updatedAt);
    booking.Spot.previewImage = "Spot has no image yet";
    booking.Spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        booking.Spot.previewImage = image.url;
      }
    });
    //get the correct order of column
    const {
      id,
      spotId,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      Spot,
    } = booking;
    const resBooking = {
      id,
      spotId,
      Spot,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    };
    Bookings.push(resBooking);
    delete booking.Spot.SpotImages;
  });
  res.json({ Bookings });
});
//----------------edit a booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const currentUserId = req.user.id;
  const { startDate, endDate } = req.body;
  //check if booking exist
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    err.title = "Booking couldn't be found";
    err.errors = ["Booking couldn't be found"];
    return next(err);
  }
  //check if booking belongs to current user
  if (booking.userId !== currentUserId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
  //check if end date is before today
  const reqStart = new Date(startDate);
  const reqEnd = new Date(endDate);
  if (reqEnd < Date.now()) {
    const err = new Error("Past bookings can't be modified");
    err.status = 403;
    return next(err);
  }
  //check if end date is before start date
  if (reqStart >= reqEnd) {
    const err = new Error("Validation error");
    err.status = 400;
    err.errors = ["endDate cannot be on or before startDate"];
    return next(err);
  }
  //check date conflict
  const spotId = booking.spotId;
  const spot = await Spot.findByPk(spotId);
  const existingBookings = await spot.getBookings();
  for (let booking of existingBookings) {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    if (reqStart <= end && reqStart >= start) {
      const err = new Error(
        "Sorry,this spot is already booked for the specified dates"
      );
      err.status = 403;
      err.title = "Sorry,this spot is already booked for the specified dates";
      err.errors = ["Start date conflicts with an existing booking"];
      return next(err);
    } else if (reqEnd <= end && reqEnd >= start) {
      const err = new Error(
        "Sorry,this spot is already booked for the specified dates"
      );
      err.status = 403;
      err.title = "Sorry,this spot is already booked for the specified dates";
      err.errors = ["End date conflicts with an existing booking"];
      return next(err);
    }
  }
  await booking.update({
    startDate,
    endDate,
  });
  await booking.save();
  const resObj = booking.toJSON();
  resObj.createdAt = dateFormat(booking.createdAt);
  resObj.updatedAt = dateFormat(booking.updatedAt);
  return res.json(resObj);
});
//----------------delete a booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const currentUserId = req.user.id;
  //check if booking exist
  const booking = await Booking.findByPk(bookingId, {
    include: { model: Spot, attributes: ["ownerId"] },
    group: ["Booking.id", "Spot.id"],
  });

  if (booking) {
    //check if booking has been started
    const startDate = new Date(booking.startDate);
    if (startDate <= Date.now()) {
      const err = new Error("Bookings that have been started can't be deleted");
      err.status = 403;
      return next(err);
    }
    //check if booking belongs to current user or spot belongs to current user
    const bookingUserId = booking.userId;
    const ownerId = booking.Spot.ownerId;
    if (bookingUserId === currentUserId || ownerId === currentUserId) {
      await booking.destroy();
      return res.json({ message: "Successfully deleted", statusCode: 200 });
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    }
  } else {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    err.title = "Booking couldn't be found";
    err.errors = ["Booking couldn't be found"];
    return next(err);
  }
});
module.exports = router;
