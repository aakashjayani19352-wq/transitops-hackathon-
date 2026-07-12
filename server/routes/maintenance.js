const express = require("express");
const router = express.Router();
const MaintenanceLog = require("../models/MaintenanceLog");
const Vehicle = require("../models/Vehicle");

// POST / - Create a maintenance log and set vehicle status to 'In Shop'
router.post("/", async (req, res) => {
  try {
    const log = new MaintenanceLog(req.body);
    await log.save();

    // Update the vehicle status to 'In Shop'
    await Vehicle.findByIdAndUpdate(log.vehicle, { status: "In Shop" });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id/close - Close a maintenance log and set vehicle status back to 'Available'
router.put("/:id/close", async (req, res) => {
  try {
    const log = await MaintenanceLog.findByIdAndUpdate(
      req.params.id,
      { status: "Closed" },
      { new: true },
    );
    if (!log)
      return res.status(404).json({ error: "Maintenance log not found" });

    // Update the vehicle status back to 'Available'
    await Vehicle.findByIdAndUpdate(log.vehicle, { status: "Available" });

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET / - List all maintenance logs with vehicle name populated
router.get("/", async (req, res) => {
  try {
    const logs = await MaintenanceLog.find().populate("vehicle");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
