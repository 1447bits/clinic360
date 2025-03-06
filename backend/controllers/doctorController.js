// controllers/doctorController.js
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Search for doctors with filters
exports.searchDoctors = async (req, res) => {
  try {
    const { specialty, location, name } = req.query;
    let query = {};

    // Add filters if provided
    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Get all matching doctors
    let doctors = await Doctor.find(query).populate('userId', 'name email');
    
    // Filter by doctor's name if provided
    if (name) {
      // First, get all user IDs that match the name
      const users = await User.find({ 
        name: { $regex: name, $options: 'i' },
        role: 'doctor'
      });
      
      const userIds = users.map(user => user._id);
      
      // Then filter the doctors array
      doctors = doctors.filter(doctor => 
        userIds.some(id => id.toString() === doctor.userId._id.toString())
      );
    }

    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get doctor profile by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone');
      
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update doctor profile
exports.updateDoctor = async (req, res) => {
  try {
    const { specialty, experienceYears, location } = req.body;

    // Check if the requesting user is the owner of the profile
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    if (doctor.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    // Update fields
    if (specialty) doctor.specialty = specialty;
    if (experienceYears) doctor.experienceYears = experienceYears;
    if (location) doctor.location = location;
    
    await doctor.save();
    
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Set availability slots for a doctor
exports.setAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    
    // Find doctor by user ID
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    // Update availability
    doctor.availability = availability;
    await doctor.save();
    
    res.json(doctor.availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get availability slots for a doctor
exports.getAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor.availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};