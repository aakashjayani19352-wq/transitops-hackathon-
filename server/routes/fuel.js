const express = require("express");
const router = express.Router();
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");

// POST / - Create a fuel log entry
router.post("/", async (req, res) => {
  try {
    const log = new FuelLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET / - List all fuel logs with vehicle name populated
router.get("/", async (req, res) => {
  try {
    const logs = await FuelLog.find().populate("vehicle");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /expenses - Create an expense entry
router.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /expenses - List all expenses with vehicle name populated
router.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().populate("vehicle");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
