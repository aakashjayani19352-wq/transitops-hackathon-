const Joi = require("joi");

const createTripSchema = Joi.object({
  source: Joi.string().required(),
  destination: Joi.string().required(),
  vehicle: Joi.string().hex().length(24).required(),
  driver: Joi.string().hex().length(24).required(),
  cargoWeight: Joi.number().min(0).required(),
  plannedDistance: Joi.number().min(0).required(),
});

const completeTripSchema = Joi.object({
  actualDistance: Joi.number().min(0).required(),
  fuelConsumed: Joi.number().min(0).required(),
});

module.exports = { createTripSchema, completeTripSchema };
