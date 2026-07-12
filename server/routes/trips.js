const express = require("express");
const router = express.Router();
const tripsController = require("../controllers/tripsController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, tripsController.createTrip);
router.put("/:id/dispatch", authMiddleware, tripsController.dispatchTrip);
router.put("/:id/complete", authMiddleware, tripsController.completeTrip);
router.put("/:id/cancel", authMiddleware, tripsController.cancelTrip);
router.get("/", authMiddleware, tripsController.getTrips);

module.exports = router;
