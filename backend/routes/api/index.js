// backend/routes/api/index.js
const router = require("express").Router();
const { restoreUser } = require("../../utils/auth");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");

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

router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
