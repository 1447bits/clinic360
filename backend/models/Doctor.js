// models/Doctor.js
const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  slots: [{
    type: String,
    required: true
  }]
});

const DoctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  availability: [availabilitySlotSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', DoctorSchema);