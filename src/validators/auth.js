const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [
    check('fullname')
    .notEmpty()
    .withMessage('fullname is required'),
    check('username')
    .notEmpty()
    .withMessage('username is required'),
    check('phone')
    .isLength({ min: 10, max: 10 })
    .withMessage('Valid phone is required'),
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')
];

exports.validateSigninRequest = [
    check('username')
    .notEmpty()
    .withMessage('Valid Username is required'),
    check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}