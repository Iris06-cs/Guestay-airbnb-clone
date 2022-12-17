// backend/routes/api/users.js
const express = require("express");
const router = express.Router();
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];
// Sign up
router.post("/", validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;
  const existsUsername = await User.findOne({
    where: {
      username,
    },
  });
  const existsEmail = await User.findOne({
    where: {
      email,
    },
  });
  if (existsUsername) {
    const err = new Error("User already exists");
    err.status = 403;
    err.title = "User already exists";
    err.errors = ["User with that username already exists"];
    return next(err);
  }
  if (existsEmail) {
    const err = new Error("User already exists");
    err.status = 403;
    err.title = "User already exists";
    err.errors = ["User with that email already exists"];
    return next(err);
  }
  const user = await User.signup({
    firstName,
    lastName,
    email,
    username,
    password,
  });

  await setTokenCookie(res, user);
  const { token } = req.cookies;
  let resObj = user.toSafeObject();
  resObj.token = token;
  user.token = token;
  return res.json({
    user: resObj,
  });
});
module.exports = router;
