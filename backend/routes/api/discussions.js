const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validations/validation-formatting");
const { requireAuth } = require("../../utils/auth");
const { User, Connection, Discussion } = require("../../db/models");

const router = express.Router();

// GET all of a user's discussions
router.get('/all/:userId(\\d+)',
  requireAuth,
  asyncHandler(async (req, res) => {
    const discussions = await Discussion.getAll(req.params.userId);
    return res.json({discussions});
  })
);

// GET all of a user's specific connection's discussions
router.get('/c/:connectId(\\d+)',
  requireAuth,
  asyncHandler(async (req, res) => {
    const discussions = await Discussion.getAll(req.params.connectId, true);
    return res.json({discussions});
  })
);

// GET all of a user's specific connection's discussion ids & titles
router.get('/c/:connectId(\\d+)/minimal',
  requireAuth,
  asyncHandler(async (req, res) => {
    //NOTE: status can be a comma separated series that will become an array
    let status = req.query.status || ['established','pending','rejected'];
    const discussions = await Discussion.getAllDiscussionIdsTitles(req.params.connectId, status);
    return res.json(discussions);
  })
);

// GET one specific discussion
router.get('/d/:discussId(\\d+)',
  requireAuth,
  asyncHandler(async (req, res) => {
    const discussion = await Discussion.getOne(req.params.discussId);
    return res.json(discussion);
  })
);

// POST new discussion
router.post('/c/:connectId(\\d+)',
  requireAuth,
  //TODO validators
  asyncHandler(async (req, res) => {
    const {title, stream} = req.body;
    const connectionId = req.params.connectId;
    const discussion = await Discussion.new({connectionId, title, stream});
    return res.json(discussion);
  })
);

// PATCH update stream
router.patch('/d/:discussId(\\d+)/update-stream',
  requireAuth,
  //TODO validators
  asyncHandler(async (req, res) => {
    const stream = req.body;
    const discussion = await Discussion.updateStream(req.params.discussId, stream);
    return res.json(discussion);
  })
);

// DELETE discussion
router.delete('/d/:discussId(\\d+)/delete',
  requireAuth,
  asyncHandler(async (req, res) => {
    const stream = req.body;
    const discussion = await Discussion.delete(req.params.discussId);
    return res.json(discussion);
  })
);

module.exports = router;
