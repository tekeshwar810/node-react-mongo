const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth');
const validate = require("../middlewares/validate");
const { signupValidation, loginValidation } = require("../validations/users.validation");

router.post('/signup', validate(signupValidation), signup);
router.post('/login', validate(loginValidation), login);

module.exports = router;