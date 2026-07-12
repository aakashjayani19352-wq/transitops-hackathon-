const mongoose = require('mongoose');

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

module.exports = mongoose.model('Vehicle', vehicleSchema);
