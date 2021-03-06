const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { userLoginValidators } = require("../../utils/validations/users")
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

// Log in
router.post(
  '/',
  userLoginValidators,
  asyncHandler(async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }),
);

// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({user});
    } else return res.json({});
  }
);

module.exports = router;
