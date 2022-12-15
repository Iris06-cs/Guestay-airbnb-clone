// backend/routes/api/session.js
const express = require("express");
const router = express.Router();
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required."),
  handleValidationErrors,
];
// Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.login({ credential, password });
  //Error Response Invalid credentials
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    // err.title = "Login failed";
    err.errors = ["The provided credentials were invalid."];
    return next(err);
  }

  await setTokenCookie(res, user);
  //Successful Response
  return res.json({
    user: user,
    // token:""???
  });
});
// Log out,delete the token
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});
// Restore session user,get current user session
router.get("/", restoreUser, (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({
      user: user.toSafeObject(),
    });
  } else return res.json({ user: null });
});
module.exports = router;
