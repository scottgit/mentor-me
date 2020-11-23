const { check, oneOf } = require('express-validator');
const db = require('../../db/models');
const { User } = db;
const { handleValidationErrors } = require("./validation-formatting");

const userSignupValidators = [
    check('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('The username is required and must be at least 3, and no more than 50 characters long.')
        .matches(/[^@]/)
        .withMessage('The username cannot contain @ symbol (it cannot be an email).')
        .custom(async (value) => {
            const username = await User.scope('loginUser').findOne({where: {username: value}})
            if(username) {
                throw new Error('That username is already in use. Please choose another.')
            }
            return true;
        }),
    check('email')
        .isLength({ min: 3, max: 50 })
        .withMessage('Email is required and must be at least 3 and no more than 50 characters long.')
        .isEmail()
        .withMessage('Email is not a valid email format.')
        .custom(async (value) => {
            const email = await User.scope('loginUser').findOne({where: {email: value}})
            if(email) {
                throw new Error('That email is already in use. Please login with it or choose another email to register.');
            }
            return true;
        }),
    check('password')
        .isLength({ min: 8, max: 50 })
        .withMessage('Password is required and must be at least 8 and not more than 50 characters long.')
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
        .withMessage('Password must contain at least one capital letter, one lower case letter, one number, and one symbol.'),
    check('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Please provide a matching value to confirm password.');
            }
            return true;
        }),
    check('goBy')
        .isLength({max: 20})
        .withMessage('The name you go by cannot exceed 20 characters '),
    check('picture')
        .isLength({max: 255})
        .withMessage('The url for the picture cannot exceed 255 characters.'),
    check('gender')
        .matches(/^Male$|^Female$|^Other$/)
        .withMessage('Please indicate your gender.'),
    check('mentorDesc')
        .custom((value, {req}) => {
          if (!value && !req.body.menteeDesc) {
            throw new Error('A description of at least one role as either a mentor or a mentee is required.');
          }
          return true;
        })
        .custom((value, {req}) => {
          if (!value && req.body.mentorIsPublic) {
            throw new Error('A mentor available to the public needs a mentor description of what you are willing to mentor in.');
          }
          return true;
        }),
    check('menteeDesc')
        .custom((value, {req}) => {
          if (!value && !req.body.mentorDesc) {
            throw new Error('A description of at least one role as either a mentor or a mentee is required.');
          }
          return true;
        })
        .custom((value, {req}) => {
          if (!value && req.body.menteeIsPublic) {
            throw new Error('A mentee available to the public needs a mentee description of what you want to learn.');
          }
          return true;
        }),
    handleValidationErrors,
]

const userLoginValidators = [
    oneOf([
        check('credential')
            .exists({ checkFalsy: true })
            .isLength({ min: 3, max: 50 }),
        check('password')
            .exists({ checkFalsy: true })
            .isLength({ min: 8, max: 50 })
        ], 'Please provide valid values that are less than 50 characters'),
    handleValidationErrors,
]

module.exports = {userSignupValidators, userLoginValidators };
