const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/auth');
const { requireSignin } = require('../../middleware');

const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');

router.post('/signup', validateSignupRequest, isRequestValidated, authController.signup);
router.post('/signin', validateSigninRequest, isRequestValidated, authController.signin);
router.get('/users', authController.getAllUsers);
router.post('/signout', requireSignin, authController.signout);
router.delete('/:id', authController.destroy);

module.exports = router;