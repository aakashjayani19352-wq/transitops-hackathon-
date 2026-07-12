const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

router.post('/', async (req, res, next) => {
  const vehicle = new Vehicle(req.body);
  await vehicle.save();
  res.status(201).json(vehicle);
});

router.get('/', async (req, res, next) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  
  const vehicles = await Vehicle.find(filter);
  res.json(vehicles);
});

router.get('/:id', async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Not found' });
  res.json(vehicle);
});

router.put('/:id', async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!vehicle) return res.status(404).json({ error: 'Not found' });
  res.json(vehicle);
});

router.delete('/:id', async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

module.exports = router;
