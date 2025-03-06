// // controllers/appointmentController.js
// const Appointment = require('../models/Appointment');
// const Doctor = require('../models/Doctor');
// const User = require('../models/User');
// const mongoose = require('mongoose');
// const { validateTimeSlot } = require('../utils/timeSlotValidator');
// const emailService = require('../utils/emailService');

// exports.getAppointments = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userRole = req.user.role;
    
//     let query = {};
    
//     if (userRole === 'patient') {
//       query.patientId = userId;
//     } else if (userRole === 'doctor') {
//       // First find the doctor document that references this user
//       const doctor = await Doctor.findOne({ userId: userId });
//       if (!doctor) {
//         return res.status(404).json({ message: 'Doctor profile not found' });
//       }
//       query.doctorId = doctor._id;
//     }
    
//     const appointments = await Appointment.find(query)
//       .populate({
//         path: 'doctorId',
//         select: 'specialty location',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       })
//       .populate({
//         path: 'patientId',
//         select: 'name email phone'
//       })
//       .sort({ date: 1, timeSlot: 1 });
    
//     res.json(appointments);
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.bookAppointment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const { doctorId, date, timeSlot } = req.body;
//     const patientId = req.user.id;
    
//     if (!doctorId || !date || !timeSlot) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
    
//     // Convert date string to Date object
//     const appointmentDate = new Date(date);
    
//     // Validate appointment date is in the future
//     if (appointmentDate < new Date()) {
//       return res.status(400).json({ message: 'Appointment date must be in the future' });
//     }
    
//     // Find doctor
//     const doctor = await Doctor.findById(doctorId).session(session);
//     if (!doctor) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
    
//     // Validate time slot exists in doctor's availability
//     const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long' });
//     const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
    
//     if (!dayAvailability || !dayAvailability.slots.includes(timeSlot)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: 'Selected time slot is not available' });
//     }
    
//     // Check if the slot is already booked
//     const existingAppointment = await Appointment.findOne({
//       doctorId,
//       date: {
//         $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
//         $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
//       },
//       timeSlot,
//       status: { $in: ['booked', 'confirmed'] }
//     }).session(session);
    
//     if (existingAppointment) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: 'This time slot is already booked' });
//     }
    
//     // Create appointment
//     const newAppointment = new Appointment({
//       patientId,
//       doctorId,
//       date: appointmentDate,
//       timeSlot,
//       status: 'booked'
//     });
    
//     await newAppointment.save({ session });
    
//     // Get doctor and patient details for email
//     const doctorUser = await User.findById(doctor.userId).session(session);
//     const patient = await User.findById(patientId).session(session);
    
//     // Send email notification
//     await emailService.sendAppointmentBookingEmail(
//       patient.email,
//       doctorUser.name,
//       appointmentDate,
//       timeSlot
//     );
    
//     await emailService.sendDoctorBookingNotification(
//       doctorUser.email,
//       patient.name,
//       appointmentDate,
//       timeSlot
//     );
    
//     await session.commitTransaction();
//     session.endSession();
    
//     res.status(201).json({ 
//       message: 'Appointment booked successfully',
//       appointment: newAppointment
//     });
    
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Error booking appointment:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.getAvailableSlots = async (req, res) => {
//   try {
//     const { doctorId, date } = req.query;
    
//     if (!doctorId || !date) {
//       return res.status(400).json({ message: 'Doctor ID and date are required' });
//     }
    
//     // Convert date string to Date object
//     const appointmentDate = new Date(date);
    
//     // Find doctor
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
    
//     // Get day of week
//     const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long' });
    
//     // Get doctor's availability for that day
//     const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
    
//     if (!dayAvailability) {
//       return res.status(200).json({ availableSlots: [] });
//     }
    
//     // Find all booked appointments for that day
//     const bookedAppointments = await Appointment.find({
//       doctorId,
//       date: {
//         $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
//         $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
//       },
//       status: { $in: ['booked', 'confirmed'] }
//     });
    
//     // Filter out booked slots
//     const bookedSlots = bookedAppointments.map(appointment => appointment.timeSlot);
//     const availableSlots = dayAvailability.slots.filter(slot => !bookedSlots.includes(slot));
    
//     res.json({ availableSlots });
    
//   } catch (error) {
//     console.error('Error fetching available slots:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.getAppointmentById = async (req, res) => {
//   try {
//     const appointmentId = req.params.id;
//     const userId = req.user.id;
//     const userRole = req.user.role;
    
//     const appointment = await Appointment.findById(appointmentId)
//       .populate({
//         path: 'doctorId',
//         select: 'specialty location',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       })
//       .populate({
//         path: 'patientId',
//         select: 'name email phone'
//       });
    
//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }
    
//     // Check if the user has permission to view this appointment
//     if (userRole === 'patient' && appointment.patientId._id.toString() !== userId) {
//       return res.status(403).json({ message: 'Not authorized to view this appointment' });
//     } else if (userRole === 'doctor') {
//       const doctor = await Doctor.findOne({ userId });
//       if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString()) {
//         return res.status(403).json({ message: 'Not authorized to view this appointment' });
//       }
//     }
    
//     res.json(appointment);
    
//   } catch (error) {
//     console.error('Error fetching appointment:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.cancelAppointment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const appointmentId = req.params.id;
//     const userId = req.user.id;
//     const userRole = req.user.role;
    
//     const appointment = await Appointment.findById(appointmentId).session(session);
    
//     if (!appointment) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: 'Appointment not found' });
//     }
    
//     // Check if the user has permission to cancel this appointment
//     if (userRole === 'patient' && appointment.patientId.toString() !== userId) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
//     } else if (userRole === 'doctor') {
//       const doctor = await Doctor.findOne({ userId }).session(session);
//       if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
//       }
//     }
    
//     // Check if appointment is already cancelled or completed
//     if (appointment.status === 'cancelled' || appointment.status === 'completed') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ 
//         message: `Cannot cancel appointment that is already ${appointment.status}` 
//       });
//     }
    
//     // Update appointment status
//     appointment.status = 'cancelled';
//     await appointment.save({ session });
    
//     // Get doctor and patient details for email notification
//     const doctor = await Doctor.findById(appointment.doctorId).session(session);
//     const doctorUser = await User.findById(doctor.userId).session(session);
//     const patient = await User.findById(appointment.patientId).session(session);
    
//     // Send cancellation emails
//     await emailService.sendAppointmentCancellationEmail(
//       patient.email,
//       doctorUser.name,
//       appointment.date,
//       appointment.timeSlot
//     );
    
//     await emailService.sendDoctorCancellationNotification(
//       doctorUser.email,
//       patient.name,
//       appointment.date,
//       appointment.timeSlot
//     );
    
//     await session.commitTransaction();
//     session.endSession();
    
//     res.json({ message: 'Appointment cancelled successfully' });
    
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Error cancelling appointment:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.confirmAppointment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const appointmentId = req.params.id;
//     const userId = req.user.id;
    
//     // Find the doctor document for this user
//     const doctor = await Doctor.findOne({ userId }).session(session);
//     if (!doctor) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: 'Doctor profile not found' });
//     }
    
//     // Find the appointment
//     const appointment = await Appointment.findById(appointmentId).session(session);
    
//     if (!appointment) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: 'Appointment not found' });
//     }
    
//     // Check if this doctor is associated with the appointment
//     if (appointment.doctorId.toString() !== doctor._id.toString()) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ message: 'Not authorized to confirm this appointment' });
//     }
    
//     // Check if appointment is already cancelled or completed
//     if (appointment.status === 'cancelled' || appointment.status === 'completed') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ 
//         message: `Cannot confirm appointment that is already ${appointment.status}` 
//       });
//     }
    
//     // Check if appointment is already confirmed
//     if (appointment.status === 'confirmed') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: 'Appointment is already confirmed' });
//     }
    
//     // Update appointment status
//     appointment.status = 'confirmed';
//     await appointment.save({ session });
    
//     // Get patient details for email notification
//     const patient = await User.findById(appointment.patientId).session(session);
//     const doctorUser = await User.findById(doctor.userId).session(session);
    
//     // Send confirmation email to patient
//     await emailService.sendAppointmentConfirmationEmail(
//       patient.email,
//       doctorUser.name,
//       appointment.date,
//       appointment.timeSlot
//     );
    
//     await session.commitTransaction();
//     session.endSession();
    
//     res.json({ 
//       message: 'Appointment confirmed successfully',
//       appointment
//     });
    
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Error confirming appointment:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const mongoose = require('mongoose');
const timeSlotUtils = require('../utils/timeSlotValidator');
const emailService = require('../utils/emailService');

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = {};
    
    if (userRole === 'patient') {
      query.patientId = userId;
    } else if (userRole === 'doctor') {
      // First find the doctor document that references this user
      const doctor = await Doctor.findOne({ userId: userId });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      query.doctorId = doctor._id;
    }
    
    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctorId',
        select: 'specialty location',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate({
        path: 'patientId',
        select: 'name email phone'
      })
      .sort({ date: 1, timeSlot: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user.id;
    
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate time slot format
    if (!timeSlotUtils.validateTimeSlotFormat(timeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot format. Use "HH:MM AM/PM - HH:MM AM/PM"' });
    }
    
    // Validate time slot logic (start time before end time)
    if (!timeSlotUtils.validateTimeSlot(timeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot. End time must be after start time' });
    }
    
    // Convert date string to Date object
    const appointmentDate = new Date(date);
    
    // Validate appointment date is in the future
    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }
    
    // Find doctor
    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Validate time slot exists in doctor's availability
    const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long' });
    const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
    
    if (!dayAvailability) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Doctor is not available on ${dayOfWeek}` });
    }
    
    // Check if the requested slot is within the doctor's available slots
    let slotIsAvailable = false;
    for (const availableSlot of dayAvailability.slots) {
      if (availableSlot === timeSlot) {
        slotIsAvailable = true;
        break;
      }
    }
    
    if (!slotIsAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }
    
    // Check if the time slot falls within working hours
    if (doctor.workingHours && doctor.workingHours.start && doctor.workingHours.end) {
      const isWithinWorkingHours = timeSlotUtils.isTimeSlotWithinWorkingHours(
        timeSlot,
        doctor.workingHours.start,
        doctor.workingHours.end
      );
      
      if (!isWithinWorkingHours) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: `Time slot is outside doctor's working hours (${doctor.workingHours.start}-${doctor.workingHours.end})` 
        });
      }
    }
    
    // Check if the slot is already booked
    const bookedAppointments = await Appointment.find({
      doctorId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      },
      status: { $in: ['booked', 'confirmed'] }
    }).session(session);
    
    // Check for overlapping appointments
    for (const bookedAppointment of bookedAppointments) {
      if (timeSlotUtils.doTimeSlotsOverlap(timeSlot, bookedAppointment.timeSlot)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'This time slot overlaps with an existing appointment' });
      }
    }
    
    // Get appointment duration in minutes
    const appointmentDuration = timeSlotUtils.calculateTimeSlotDuration(timeSlot);
    if (appointmentDuration < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Unable to calculate appointment duration' });
    }
    
    // Create appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date: appointmentDate,
      timeSlot,
      duration: appointmentDuration,
      status: 'booked'
    });
    
    await newAppointment.save({ session });
    
    // Get doctor and patient details for email
    const doctorUser = await User.findById(doctor.userId).session(session);
    const patient = await User.findById(patientId).session(session);
    
    // Send email notification
    await emailService.sendAppointmentBookingEmail(
      patient.email,
      doctorUser.name,
      appointmentDate,
      timeSlot
    );
    
    await emailService.sendDoctorBookingNotification(
      doctorUser.email,
      patient.name,
      appointmentDate,
      timeSlot
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({ 
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }
    
    // Convert date string to Date object
    const appointmentDate = new Date(date);
    
    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Get day of week
    const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long' });
    
    // Get doctor's availability for that day
    const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
    
    if (!dayAvailability) {
      return res.status(200).json({ availableSlots: [] });
    }
    
    // If the doctor has specified a slot duration and working hours, generate the slots
    if (doctor.appointmentDuration && doctor.workingHours && doctor.workingHours.start && doctor.workingHours.end) {
      const generatedSlots = timeSlotUtils.generateTimeSlots(
        doctor.workingHours.start,
        doctor.workingHours.end,
        doctor.appointmentDuration
      );
      
      // Filter out slots that don't match the doctor's availability pattern
      const availableGeneratedSlots = generatedSlots.filter(slot => {
        return dayAvailability.slots.some(availableSlot => {
          return timeSlotUtils.doTimeSlotsOverlap(slot, availableSlot);
        });
      });
      
      // Find all booked appointments for that day
      const bookedAppointments = await Appointment.find({
        doctorId,
        date: {
          $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        status: { $in: ['booked', 'confirmed'] }
      });
      
      // Filter out booked slots
      const availableSlots = availableGeneratedSlots.filter(slot => {
        return !bookedAppointments.some(appointment => {
          return timeSlotUtils.doTimeSlotsOverlap(slot, appointment.timeSlot);
        });
      });
      
      return res.json({ availableSlots });
    }
    
    // Otherwise use the doctor's predefined slots
    // Find all booked appointments for that day
    const bookedAppointments = await Appointment.find({
      doctorId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['booked', 'confirmed'] }
    });
    
    // Filter out booked slots using overlap check
    const availableSlots = dayAvailability.slots.filter(slot => {
      return !bookedAppointments.some(appointment => {
        return timeSlotUtils.doTimeSlotsOverlap(slot, appointment.timeSlot);
      });
    });
    
    res.json({ availableSlots });
    
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: 'doctorId',
        select: 'specialty location',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate({
        path: 'patientId',
        select: 'name email phone'
      });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user has permission to view this appointment
    if (userRole === 'patient' && appointment.patientId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    } else if (userRole === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this appointment' });
      }
    }
    
    // Add duration information if not already present
    if (!appointment.duration) {
      appointment._doc.duration = timeSlotUtils.calculateTimeSlotDuration(appointment.timeSlot);
    }
    
    res.json(appointment);
    
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const appointment = await Appointment.findById(appointmentId).session(session);
    
    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user has permission to cancel this appointment
    if (userRole === 'patient' && appointment.patientId.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    } else if (userRole === 'doctor') {
      const doctor = await Doctor.findOne({ userId }).session(session);
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
      }
    }
    
    // Check if appointment is already cancelled or completed
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: `Cannot cancel appointment that is already ${appointment.status}` 
      });
    }
    
    // Update appointment status
    appointment.status = 'cancelled';
    await appointment.save({ session });
    
    // Get doctor and patient details for email notification
    const doctor = await Doctor.findById(appointment.doctorId).session(session);
    const doctorUser = await User.findById(doctor.userId).session(session);
    const patient = await User.findById(appointment.patientId).session(session);
    
    // // Send cancellation emails
    // await emailService.sendAppointmentCancellationEmail(
    //   patient.email,
    //   doctorUser.name,
    //   appointment.date,
    //   appointment.timeSlot
    // );
    
    // await emailService.sendDoctorCancellationNotification(
    //   doctorUser.email,
    //   patient.name,
    //   appointment.date,
    //   appointment.timeSlot
    // );
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({ message: 'Appointment cancelled successfully' });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.confirmAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    
    // Find the doctor document for this user
    const doctor = await Doctor.findOne({ userId }).session(session);
    if (!doctor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId).session(session);
    
    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if this doctor is associated with the appointment
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Not authorized to confirm this appointment' });
    }
    
    // Check if appointment is already cancelled or completed
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: `Cannot confirm appointment that is already ${appointment.status}` 
      });
    }
    
    // Check if appointment is already confirmed
    if (appointment.status === 'confirmed') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Appointment is already confirmed' });
    }
    
    // Validate the time slot again
    if (!timeSlotUtils.validateTimeSlotFormat(appointment.timeSlot)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Appointment has invalid time slot format' });
    }
    
    if (!timeSlotUtils.validateTimeSlot(appointment.timeSlot)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Appointment has invalid time slot' });
    }
    
    // Update appointment status
    appointment.status = 'confirmed';
    
    // Add duration information if not already present
    if (!appointment.duration) {
      appointment.duration = timeSlotUtils.calculateTimeSlotDuration(appointment.timeSlot);
    }
    
    await appointment.save({ session });
    
    // Get patient details for email notification
    const patient = await User.findById(appointment.patientId).session(session);
    const doctorUser = await User.findById(doctor.userId).session(session);
    
    // Send confirmation email to patient
    await emailService.sendAppointmentConfirmationEmail(
      patient.email,
      doctorUser.name,
      appointment.date,
      appointment.timeSlot
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({ 
      message: 'Appointment confirmed successfully',
      appointment
    });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error confirming appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const appointmentId = req.params.id;
    const { newDate, newTimeSlot } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (!newDate || !newTimeSlot) {
      return res.status(400).json({ message: 'New date and time slot are required' });
    }
    
    // Validate new time slot format
    if (!timeSlotUtils.validateTimeSlotFormat(newTimeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot format. Use "HH:MM AM/PM - HH:MM AM/PM"' });
    }
    
    // Validate new time slot logic
    if (!timeSlotUtils.validateTimeSlot(newTimeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot. End time must be after start time' });
    }
    
    // Convert date string to Date object
    const newAppointmentDate = new Date(newDate);
    
    // Validate new appointment date is in the future
    if (newAppointmentDate < new Date()) {
      return res.status(400).json({ message: 'New appointment date must be in the future' });
    }
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId).session(session);
    
    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user has permission to reschedule this appointment
    if (userRole === 'patient' && appointment.patientId.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Not authorized to reschedule this appointment' });
    } else if (userRole === 'doctor') {
      const doctor = await Doctor.findOne({ userId }).session(session);
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: 'Not authorized to reschedule this appointment' });
      }
    }
    
    // Check if appointment is already cancelled or completed
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: `Cannot reschedule appointment that is already ${appointment.status}` 
      });
    }
    
    // Find doctor
    const doctor = await Doctor.findById(appointment.doctorId).session(session);
    
    // Check if the new slot is available in doctor's schedule
    const dayOfWeek = newAppointmentDate.toLocaleString('en-US', { weekday: 'long' });
    const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
    
    if (!dayAvailability) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Doctor is not available on ${dayOfWeek}` });
    }
    
    // Check if the time slot falls within working hours
    if (doctor.workingHours && doctor.workingHours.start && doctor.workingHours.end) {
      const isWithinWorkingHours = timeSlotUtils.isTimeSlotWithinWorkingHours(
        newTimeSlot,
        doctor.workingHours.start,
        doctor.workingHours.end
      );
      
      if (!isWithinWorkingHours) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: `Time slot is outside doctor's working hours (${doctor.workingHours.start}-${doctor.workingHours.end})` 
        });
      }
    }
    
    // Find all booked appointments for that day
    const bookedAppointments = await Appointment.find({
      doctorId: appointment.doctorId,
      _id: { $ne: appointmentId }, // Exclude current appointment
      date: {
        $gte: new Date(newAppointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(newAppointmentDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['booked', 'confirmed'] }
    }).session(session);
    
    // Check for overlapping appointments
    for (const bookedAppointment of bookedAppointments) {
      if (timeSlotUtils.doTimeSlotsOverlap(newTimeSlot, bookedAppointment.timeSlot)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'This time slot overlaps with an existing appointment' });
      }
    }
    
    // Get appointment duration in minutes
    const appointmentDuration = timeSlotUtils.calculateTimeSlotDuration(newTimeSlot);
    if (appointmentDuration < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Unable to calculate appointment duration' });
    }
    
    // Save old data for notification
    const oldDate = appointment.date;
    const oldTimeSlot = appointment.timeSlot;
    
    // Update appointment
    appointment.date = newAppointmentDate;
    appointment.timeSlot = newTimeSlot;
    appointment.duration = appointmentDuration;
    appointment.lastRescheduled = new Date();
    
    await appointment.save({ session });
    
    // Get doctor and patient details for email notification
    const doctorUser = await User.findById(doctor.userId).session(session);
    const patient = await User.findById(appointment.patientId).session(session);
    
    // Send rescheduling emails
    await emailService.sendAppointmentRescheduleEmail(
      patient.email,
      doctorUser.name,
      oldDate,
      oldTimeSlot,
      newAppointmentDate,
      newTimeSlot
    );
    
    await emailService.sendDoctorRescheduleNotification(
      doctorUser.email,
      patient.name,
      oldDate,
      oldTimeSlot,
      newAppointmentDate,
      newTimeSlot
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({ 
      message: 'Appointment rescheduled successfully',
      appointment
    });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};