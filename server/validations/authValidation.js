const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('fleet_manager', 'driver', 'safety_officer', 'financial_analyst').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { signupSchema, loginSchema };
