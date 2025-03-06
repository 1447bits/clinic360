// utils/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: true,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

/**
 * Send a generic email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text version of the email
 * @param {string} html - HTML version of the email (optional)
 */
exports.sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"${config.EMAIL_USER}" <${config.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send an appointment booking confirmation email to patient
 * @param {string} patientEmail - Patient's email address
 * @param {string} doctorName - Doctor's name
 * @param {Date} appointmentDate - Appointment date
 * @param {string} timeSlot - Appointment time slot
 */
exports.sendAppointmentBookingEmail = async (patientEmail, doctorName, appointmentDate, timeSlot) => {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = 'Appointment Confirmation';

  const text = `
    Dear Patient,
    
    Your appointment with Dr. ${doctorName} has been successfully booked.
    
    Appointment Details:
    - Date: ${formattedDate}
    - Time: ${timeSlot}
    
    Please arrive 15 minutes before your scheduled appointment time.
    
    If you need to cancel or reschedule, please do so at least 24 hours in advance.
    
    Thank you for using our service.
    
    Best regards,
    Medical Appointment System
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Appointment Confirmation</h2>
      <p>Dear Patient,</p>
      <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been successfully booked.</p>
      
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${timeSlot}</li>
      </ul>
      
      <p>Please arrive 15 minutes before your scheduled appointment time.</p>
      <p>If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
      
      <p>Thank you for using our service.</p>
      
      <p>Best regards,<br>
      Medical Appointment System</p>
    </div>
  `;

  return await exports.sendEmail(patientEmail, subject, text, html);
};

/**
 * Send an appointment confirmation email to doctor
 * @param {string} doctorEmail - Doctor's email address
 * @param {string} patientName - Patient's name
 * @param {Date} appointmentDate - Appointment date
 * @param {string} timeSlot - Appointment time slot
 */
exports.sendDoctorBookingNotification = async (doctorEmail, patientName, appointmentDate, timeSlot) => {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = 'New Appointment Scheduled';

  const text = `
    Dear Doctor,
    
    A new appointment has been scheduled with patient ${patientName}.
    
    Appointment Details:
    - Date: ${formattedDate}
    - Time: ${timeSlot}
    
    Please login to the system to confirm this appointment.
    
    Best regards,
    Medical Appointment System
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Appointment Scheduled</h2>
      <p>Dear Doctor,</p>
      <p>A new appointment has been scheduled with patient <strong>${patientName}</strong>.</p>
      
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${timeSlot}</li>
      </ul>
      
      <p>Please login to the system to confirm this appointment.</p>
      
      <p>Best regards,<br>
      Medical Appointment System</p>
    </div>
  `;

  return await exports.sendEmail(doctorEmail, subject, text, html);
};

/**
 * Send an appointment cancellation email to patient
 * @param {string} patientEmail - Patient's email address
 * @param {string} doctorName - Doctor's name
 * @param {Date} appointmentDate - Appointment date
 * @param {string} timeSlot - Appointment time slot
 */
exports.sendAppointmentCancellationEmail = async (patientEmail, doctorName, appointmentDate, timeSlot) => {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = 'Appointment Cancellation';

  const text = `
    Dear Patient,
    
    Your appointment with Dr. ${doctorName} on ${formattedDate} at ${timeSlot} has been cancelled.
    
    If you would like to reschedule, please login to our system and book a new appointment.
    
    We apologize for any inconvenience.
    
    Best regards,
    Medical Appointment System
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Appointment Cancellation</h2>
      <p>Dear Patient,</p>
      <p>Your appointment with <strong>Dr. ${doctorName}</strong> on <strong>${formattedDate}</strong> at <strong>${timeSlot}</strong> has been cancelled.</p>
      
      <p>If you would like to reschedule, please login to our system and book a new appointment.</p>
      
      <p>We apologize for any inconvenience.</p>
      
      <p>Best regards,<br>
      Medical Appointment System</p>
    </div>
  `;

  return await exports.sendEmail(patientEmail, subject, text, html);
};

/**
 * Send an appointment cancellation notification to doctor
 * @param {string} doctorEmail - Doctor's email address
 * @param {string} patientName - Patient's name
 * @param {Date} appointmentDate - Appointment date
 * @param {string} timeSlot - Appointment time slot
 */
exports.sendDoctorCancellationNotification = async (doctorEmail, patientName, appointmentDate, timeSlot) => {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = 'Appointment Cancellation Notification';

  const text = `
    Dear Doctor,
    
    The appointment with patient ${patientName} on ${formattedDate} at ${timeSlot} has been cancelled.
    
    This time slot is now available for other bookings.
    
    Best regards,
    Medical Appointment System
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Appointment Cancellation Notification</h2>
      <p>Dear Doctor,</p>
      <p>The appointment with patient <strong>${patientName}</strong> on <strong>${formattedDate}</strong> at <strong>${timeSlot}</strong> has been cancelled.</p>
      
      <p>This time slot is now available for other bookings.</p>
      
      <p>Best regards,<br>
      Medical Appointment System</p>
    </div>
  `;

  return await exports.sendEmail(doctorEmail, subject, text, html);
};

/**
 * Send an appointment confirmation email to patient
 * @param {string} patientEmail - Patient's email address
 * @param {string} doctorName - Doctor's name
 * @param {Date} appointmentDate - Appointment date
 * @param {string} timeSlot - Appointment time slot
 */
exports.sendAppointmentConfirmationEmail = async (patientEmail, doctorName, appointmentDate, timeSlot) => {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = 'Appointment Confirmed';

  const text = `
    Dear Patient,
    
    Your appointment with Dr. ${doctorName} has been confirmed by the doctor.
    
    Appointment Details:
    - Date: ${formattedDate}
    - Time: ${timeSlot}
    
    Please arrive 15 minutes before your scheduled appointment time.
    
    If you need to cancel, please do so at least 24 hours in advance.
    
    Thank you for using our service.
    
    Best regards,
    Medical Appointment System
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Appointment Confirmed</h2>
      <p>Dear Patient,</p>
      <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been confirmed by the doctor.</p>
      
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${timeSlot}</li>
      </ul>
      
      <p>Please arrive 15 minutes before your scheduled appointment time.</p>
      <p>If you need to cancel, please do so at least 24 hours in advance.</p>
      
      <p>Thank you for using our service.</p>
      
      <p>Best regards,<br>
      Medical Appointment System</p>
    </div>
  `;

  return await exports.sendEmail(patientEmail, subject, text, html);
};

/**
 * Send appointment reminder email
 * @param {string} patientEmail - Patient's email address
 * @param {string} doctorName - Doctor's name
 * @param {Date} appointmentDate - Appointment date
 * @param {string} timeSlot - Appointment time slot
 */
exports.sendAppointmentReminderEmail = async (patientEmail, doctorName, appointmentDate, timeSlot) => {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = 'Appointment Reminder';

  const text = `
    Dear Patient,
    
    This is a friendly reminder about your upcoming appointment with Dr. ${doctorName}.
    
    Appointment Details:
    - Date: ${formattedDate}
    - Time: ${timeSlot}
    
    Please arrive 15 minutes before your scheduled appointment time.
    
    If you need to cancel, please do so as soon as possible.
    
    Thank you for using our service.
    
    Best regards,
    Medical Appointment System
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Appointment Reminder</h2>
      <p>Dear Patient,</p>
      <p>This is a friendly reminder about your upcoming appointment with <strong>Dr. ${doctorName}</strong>.</p>
      
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${timeSlot}</li>
      </ul>
      
      <p>Please arrive 15 minutes before your scheduled appointment time.</p>
      <p>If you need to cancel, please do so as soon as possible.</p>
      
      <p>Thank you for using our service.</p>
      
      <p>Best regards,<br>
      Medical Appointment System</p>
    </div>
  `;

  return await exports.sendEmail(patientEmail, subject, text, html);
};