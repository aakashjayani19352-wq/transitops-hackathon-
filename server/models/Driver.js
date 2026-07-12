const mongoose = require('mongoose');

<<<<<<< HEAD
const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    licenseCategory: {
      type: String,
      trim: true,
    },
    licenseExpiryDate: {
      type: Date,
      required: [true, 'License expiry date is required'],
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    safetyScore: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
      default: 'Available',
    },
  },
  { timestamps: true }
);
=======
const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    unique: true,
    required: true
  },
  licenseCategory: {
    type: String
  },
  licenseExpiryDate: {
    type: Date,
    required: true
  },
  contactNumber: {
    type: String
  },
  safetyScore: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
    default: 'Available'
  }
});
>>>>>>> origin/main

module.exports = mongoose.model('Driver', driverSchema);
