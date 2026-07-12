const mongoose = require('mongoose');

<<<<<<< HEAD
const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      trim: true,
    },
    maxLoadCapacity: {
      type: Number,
      required: [true, 'Max load capacity is required'],
    },
    odometer: {
      type: Number,
      default: 0,
    },
    acquisitionCost: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
      default: 'Available',
    },
  },
  { timestamps: true }
);
=======
const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  maxLoadCapacity: {
    type: Number,
    required: true
  },
  odometer: {
    type: Number,
    default: 0
  },
  acquisitionCost: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
    default: 'Available'
  }
});
>>>>>>> origin/main

module.exports = mongoose.model('Vehicle', vehicleSchema);
