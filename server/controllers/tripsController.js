const Trip = require('../models/Trip');
const { createTripSchema, completeTripSchema } = require('../validations/tripValidation');

const getModel = (modelName) => {
  const mongoose = require('mongoose');
  try {
    return mongoose.model(modelName);
  } catch (e) {
    return require(`../models/${modelName}`);
  }
};

const createTrip = async (req, res) => {
  const { error } = createTripSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;
  
  const Vehicle = getModel('Vehicle');
  const vehicleDoc = await Vehicle.findById(vehicle);
  
  if (!vehicleDoc) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }

  if (cargoWeight > vehicleDoc.maxLoadCapacity) {
    const err = new Error('Cargo weight exceeds vehicle max load capacity');
    err.statusCode = 400;
    throw err;
  }

  const trip = new Trip({
    source,
    destination,
    vehicle,
    driver,
    cargoWeight,
    plannedDistance,
    status: 'Draft'
  });

  await trip.save();
  res.status(201).json(trip);
};

const dispatchTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    const err = new Error('Trip not found');
    err.statusCode = 404;
    throw err;
  }

  const Vehicle = getModel('Vehicle');
  const Driver = getModel('Driver');

  const vehicleDoc = await Vehicle.findById(trip.vehicle);
  const driverDoc = await Driver.findById(trip.driver);

  if (!vehicleDoc || !driverDoc) {
    const err = new Error('Vehicle or Driver not found');
    err.statusCode = 404;
    throw err;
  }

  if (vehicleDoc.status !== 'Available') {
    const err = new Error('Vehicle is not available');
    err.statusCode = 400;
    throw err;
  }

  if (driverDoc.status !== 'Available') {
    const err = new Error('Driver is not available');
    err.statusCode = 400;
    throw err;
  }

  if (driverDoc.status === 'Suspended') {
    const err = new Error('Driver is suspended');
    err.statusCode = 400;
    throw err;
  }

  if (driverDoc.licenseExpiryDate && new Date(driverDoc.licenseExpiryDate) < new Date()) {
    const err = new Error('Driver license has expired');
    err.statusCode = 400;
    throw err;
  }

  trip.status = 'Dispatched';
  vehicleDoc.status = 'On Trip';
  driverDoc.status = 'On Trip';

  await trip.save();
  await vehicleDoc.save();
  await driverDoc.save();

  res.json(trip);
};

const completeTrip = async (req, res) => {
  const { error } = completeTripSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const { actualDistance, fuelConsumed } = req.body;
  
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    const err = new Error('Trip not found');
    err.statusCode = 404;
    throw err;
  }

  const Vehicle = getModel('Vehicle');
  const Driver = getModel('Driver');

  const vehicleDoc = await Vehicle.findById(trip.vehicle);
  const driverDoc = await Driver.findById(trip.driver);

  trip.actualDistance = actualDistance;
  trip.fuelConsumed = fuelConsumed;
  trip.status = 'Completed';
  
  if (vehicleDoc) {
    vehicleDoc.status = 'Available';
    await vehicleDoc.save();
  }
  
  if (driverDoc) {
    driverDoc.status = 'Available';
    await driverDoc.save();
  }

  await trip.save();
  res.json(trip);
};

const cancelTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    const err = new Error('Trip not found');
    err.statusCode = 404;
    throw err;
  }

  if (trip.status !== 'Dispatched') {
    const err = new Error('Only dispatched trips can be cancelled');
    err.statusCode = 400;
    throw err;
  }

  const Vehicle = getModel('Vehicle');
  const Driver = getModel('Driver');

  const vehicleDoc = await Vehicle.findById(trip.vehicle);
  const driverDoc = await Driver.findById(trip.driver);

  trip.status = 'Cancelled';
  
  if (vehicleDoc) {
    vehicleDoc.status = 'Available';
    await vehicleDoc.save();
  }
  
  if (driverDoc) {
    driverDoc.status = 'Available';
    await driverDoc.save();
  }

  await trip.save();
  res.json(trip);
};

const getTrips = async (req, res) => {
  getModel('Vehicle');
  getModel('Driver');

  const trips = await Trip.find()
    .populate('vehicle', 'name')
    .populate('driver', 'name');
  res.json(trips);
};

module.exports = { createTrip, dispatchTrip, completeTrip, cancelTrip, getTrips };
