const express = require("express");
const { signup, signin, update, destroy } = require("../controllers/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.put("/user/update", update);
router.post("/user/delete", destroy);

module.exports = router;
