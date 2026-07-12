const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');


// POST / - Create a new driver
router.post('/', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    const saved = await driver.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      const message =
        err.code === 11000
          ? 'A driver with this license number already exists'
          : err.message;
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET / - List all drivers (optional filter: ?status=X)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const drivers = await Driver.find(filter);
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:id - Get a single driver
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.status(200).json(driver);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid driver ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /:id - Update a driver
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.status(200).json(driver);
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      const message =
        err.code === 11000
          ? 'A driver with this license number already exists'
          : err.message;
      return res.status(400).json({ error: message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid driver ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /:id - Delete a driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid driver ID' });
    }
    res.status(500).json({ error: 'Server error' });
  }

});

module.exports = router;
