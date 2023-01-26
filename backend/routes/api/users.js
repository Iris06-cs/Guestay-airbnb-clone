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
  let duplicateUserError = {
    message: "User already exists",
    statusCode: 403,
    title: "User already exists",
    errors: [],
  };
  if (existsUsername) {
    duplicateUserError.errors.push("User with that username already exists");
  }
  if (existsEmail) {
    duplicateUserError.errors.push("User with that email already exists");
  }
  if (duplicateUserError.errors.length) {
    res.status(403);
    res.json(duplicateUserError);
    return;
  }
  const user = await User.signup({
    firstName,
    lastName,
    email,
    username,
    password,
  });

  const token = await setTokenCookie(res, user);
  // const { token } = req.cookies;
  let resObj = user.toSafeObject();
  resObj.token = token;
  user.token = token;
  return res.json({
    user: resObj,
  });
});
module.exports = router;
