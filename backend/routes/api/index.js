// backend/routes/api/index.js
const router = require("express").Router();
const { restoreUser } = require("../../utils/auth");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");

//testing auth middleware route
// // GET /api/set-token-cookie
// const { setTokenCookie } = require("../../utils/auth.js");
// const { User } = require("../../db/models");
// router.get("/set-token-cookie", async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: "FakeUser1",
//     },
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });
// // GET /api/restore-user
// const { restoreUser } = require("../../utils/auth.js");
// router.use(restoreUser);
// router.get("/restore-user", (req, res) => {
//   return res.json(req.user);
// });
// // GET /api/require-auth
// const { requireAuth } = require("../../utils/auth.js");
// router.get("/require-auth", requireAuth, (req, res) => {
//   return res.json(req.user);
// });
//test api route

//connect to restoreUser middleware
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);
//connect to sessionRouter
router.use("/session", sessionRouter);
//connect to userRouter
router.use("/users", usersRouter);
router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
