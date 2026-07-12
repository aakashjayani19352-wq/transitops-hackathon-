const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { authMiddleware } = require('../middleware/authMiddleware');

// Helper to safely get models that teammates are building
const getModel = (modelName) => {
  const mongoose = require('mongoose');
  try {
    return mongoose.model(modelName);
  } catch (e) {
    return require(`../models/${modelName}`);
  }
};

// POST /
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;
    
    const Vehicle = getModel('Vehicle');
    const vehicleDoc = await Vehicle.findById(vehicle);
    
    if (!vehicleDoc) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (cargoWeight > vehicleDoc.maxLoadCapacity) {
      return res.status(400).json({ error: 'Cargo weight exceeds vehicle max load capacity' });
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
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /:id/dispatch
router.put('/:id/dispatch', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const Vehicle = getModel('Vehicle');
    const Driver = getModel('Driver');

    const vehicleDoc = await Vehicle.findById(trip.vehicle);
    const driverDoc = await Driver.findById(trip.driver);

    if (!vehicleDoc || !driverDoc) {
      return res.status(404).json({ error: 'Vehicle or Driver not found' });
    }

    if (vehicleDoc.status !== 'Available') {
      return res.status(400).json({ error: 'Vehicle is not available' });
    }

    if (driverDoc.status !== 'Available') {
      return res.status(400).json({ error: 'Driver is not available' });
    }

    if (driverDoc.status === 'Suspended') {
      return res.status(400).json({ error: 'Driver is suspended' });
    }

    if (driverDoc.licenseExpiryDate && new Date(driverDoc.licenseExpiryDate) < new Date()) {
      return res.status(400).json({ error: 'Driver license has expired' });
    }

    trip.status = 'Dispatched';
    vehicleDoc.status = 'On Trip';
    driverDoc.status = 'On Trip';

    await trip.save();
    await vehicleDoc.save();
    await driverDoc.save();

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /:id/complete
router.put('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const { actualDistance, fuelConsumed } = req.body;
    
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
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
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /:id/cancel
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ error: 'Only dispatched trips can be cancelled' });
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
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Ensure models are registered for population to work
    getModel('Vehicle');
    getModel('Driver');

    const trips = await Trip.find()
      .populate('vehicle', 'name')
      .populate('driver', 'name');
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
