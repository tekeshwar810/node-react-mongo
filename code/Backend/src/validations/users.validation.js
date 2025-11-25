const Joi = require('joi');

const signupValidation = Joi.object({
    name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).min(2).max(50).required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    mobile: Joi.string().required(),
})

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

module.exports = { signupValidation, loginValidation }