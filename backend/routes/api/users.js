const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validations/validation-formatting");
const { userSignupValidators } = require("../../utils/validations/users")
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

// Sign up
router.post(
  '',
  userSignupValidators,
  asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    const user = await User.signup({
      email,
      username,
      password,
      confirmPassword,
      goBy,
      picture,
      gender,
      mentorDesc,
      mentorIsPublic,
      menteeDesc,
      menteeIsPublic
    });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }),
);

module.exports = router;
