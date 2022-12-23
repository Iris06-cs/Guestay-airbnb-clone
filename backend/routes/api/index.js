// backend/routes/api/index.js
const router = require("express").Router();
const { restoreUser } = require("../../utils/auth");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewRouter = require("./reviews.js");
const bookingRouter = require("./bookings.js");
const spotImageRouter = require("./spot-images.js");
const reviewImageRouter = require("./review-images.js");
//connect to restoreUser middleware
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);
//connect to sessionRouter
router.use("/session", sessionRouter);
//connect to userRouter
router.use("/users", usersRouter);
//connect to spotsRouter
router.use("/spots", spotsRouter);
//connect to reviewRouter
router.use("/reviews", reviewRouter);
//connect to bookingRouter
router.use("/bookings", bookingRouter);
//connect to spotImageRouter
router.use("/spot-images", spotImageRouter);
//connect to reviewImageRouter
router.use("/review-images", reviewImageRouter);

router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
