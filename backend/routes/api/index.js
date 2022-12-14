const { restoreUser } = require("../../utils/auth");

// backend/routes/api/index.js
const router = require("express").Router();

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
router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});
//connect to restoreUser middleware
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

module.exports = router;
