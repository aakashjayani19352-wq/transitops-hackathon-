const mongoose = require('mongoose');

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

module.exports = mongoose.model('Driver', driverSchema);
