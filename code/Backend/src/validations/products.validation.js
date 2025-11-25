const Joi = require('joi');

const addProductValidation = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().min(10).max(500).required().messages({
        'string.empty': `description cannot be an empty field`,
        'string.min': `description should have a minimum length of 10`,
        'string.max': `description should have a maximum length of 500`,
        'any.required': `description is required.`
    }),
    category: Joi.number().required(),
})

const updateProductValidation = Joi.object({
    name: Joi.string(),
    price: Joi.number().positive(),
    description: Joi.string().min(10).max(500).messages({
        'string.empty': `description cannot be an empty field`,
        'string.min': `description should have a minimum length of 10`,
        'string.max': `description should have a maximum length of 500`
    }),
    category: Joi.number(),
})

module.exports = { addProductValidation, updateProductValidation }