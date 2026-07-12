const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// POST / - Create a new vehicle
router.post('/', async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const saved = await vehicle.save();
    res.status(201).json(saved);
  } catch (err) {
    // Mongoose validation error or duplicate key
    if (err.name === 'ValidationError' || err.code === 11000) {
      const message =
        err.code === 11000
          ? 'A vehicle with this registration number already exists'
          : err.message;
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET / - List all vehicles (optional filters: ?status=X&type=X)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const vehicles = await Vehicle.find(filter);
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:id - Get a single vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid vehicle ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /:id - Update a vehicle
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      const message =
        err.code === 11000
          ? 'A vehicle with this registration number already exists'
          : err.message;
      return res.status(400).json({ error: message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid vehicle ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /:id - Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid vehicle ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
