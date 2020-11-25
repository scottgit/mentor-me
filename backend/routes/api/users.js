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
      menteeIsPublic,
      createdAt,
      updatedAt,
    });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }),
);


/***** PUBLIC LISTINGS ******/
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


/***** CONNECTIONS ******/

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

// Get User's Requests to be a Mentor
router.get(
  '/:id(\\d+)/requests',
  requireAuth,
  asyncHandler(async (req, res) => {
    const requests = await User.getPendingMenteeRequestsForId(req.params.id);
    return res.json({requests});
  })
);

// Get User's Invites to be a Mentee
router.get(
  '/:id(\\d+)/invites',
  requireAuth,
  asyncHandler(async (req, res) => {
    const invites = await User.getPendingMentorInvitesForId(req.params.id);
    return res.json({invites});
  })
);

// Post Invite/Request as Pending Connection
router.post(
  '/:id(\\d+)/pending',
  requireAuth,
    //TODO pendingvalidators,
  asyncHandler(async (req, res) => {
    const connection = req.body;

    const pending = await Connection.createPending(connection);
    return res.json({...pending});
  })
)

// Post Invite/Request as Pending Connection
// router.patch(
//   '/:id(\\d+)/accept',
//   requireAuth,
//   //TODO acceptValidators,
//   asyncHandler(async (req, res) => {
//     const {connection} = req.body;
//     const pending = await Connection.createPending(connection);
//     return res.json({...pending});
//   })
// )


module.exports = router;
