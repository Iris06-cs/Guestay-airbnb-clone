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
module.exports = router;
