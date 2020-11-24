const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validations/validation-formatting");
const { userSignupValidators } = require("../../utils/validations/users")
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Connection } = require("../../db/models");

const router = express.Router();

// Sign up
router.post(
  '',
  userSignupValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      username,
      password,
      confirmPassword,
      hashedPassword,
      goBy,
      picture,
      gender,
      mentorDesc,
      mentorIsPublic,
      menteeDesc,
      menteeIsPublic } = req.body;

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

// Get User's Mentors
router.get(
  '/:id(\\d+)/mentors',
  requireAuth,
  asyncHandler(async (req, res) => {
    const mentors = await User.getMentorsForId(req.params.id);
    return res.json({mentors});
  })
);

// Get User's Mentees
router.get(
  '/:id(\\d+)/mentees',
  requireAuth,
  asyncHandler(async (req, res) => {
    const mentees = await User.getMenteesForId(req.params.id);
    return res.json({mentees});
  })
);

// Get Public Mentors

router.get(
  '/public/mentors',
  requireAuth,
  asyncHandler(async (req, res) => {
    const mentors = await User.getPublicMentors();
    return res.json({mentors});
  })
);

// Get Public Mentees
router.get(
  '/public/mentees',
  requireAuth,
  asyncHandler(async (req, res) => {
    const mentees = await User.getPublicMentees();
    return res.json({mentees});
  })
);

module.exports = router;
