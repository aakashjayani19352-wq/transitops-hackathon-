const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

router.post('/', async (req, res, next) => {
  const driver = new Driver(req.body);
  await driver.save();
  res.status(201).json(driver);
});

router.get('/', async (req, res, next) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  
  const drivers = await Driver.find(filter);
  res.json(drivers);
});

router.get('/:id', async (req, res, next) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ error: 'Not found' });
  res.json(driver);
});

router.put('/:id', async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!driver) return res.status(404).json({ error: 'Not found' });
  res.json(driver);
});

router.delete('/:id', async (req, res, next) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

module.exports = router;
