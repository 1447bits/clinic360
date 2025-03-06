<brief>
User types : doctor and patient

1. User Authentication & Role Management:
- Implement JWT-based authentication for Doctors and Patients.
- Patients can register/login and manage appointments.
- Doctors can register/login and set availability.
- Secure password hashing using bcrypt.js.

2. Doctor Search & Profile Management
- Patients should be able to search for doctors using the following filters:
- Specialty (e.g., Cardiologist, Dermatologist).
- Location (City, State).
- Doctor’s Name (partial match search).
- Create a Doctor Profile Page displaying: Name, Specialty, Experience, Location, and Availability Slots.

3. Appointment Booking System
- Doctors set availability (working hours and consultation locations).
- Patients can book an available slot with a doctor.
- Ensure concurrency handling to prevent double booking (MongoDB transactions)
- Patients can cancel an appointment
- Send email notifications for bookings or cancellations using Nodemailer.
</brief>

<technical_specification>
1. API Routes

Authentication & Role Management
1. POST /auth/register/patient: Register a new patient.
2. POST /auth/register/doctor: Register a new doctor.
3. POST /auth/login: Login for both doctors and patients (JWT token issuance).
4. GET /auth/me: Get logged-in user details (patient or doctor).
5. POST /auth/logout: Logout the user (invalidate JWT token).
6. POST /auth/reset-password: Request password reset email for patients/doctors.

Doctor Search & Profile Management
1. GET /doctors: Search for doctors (query parameters for filters like specialty, location, doctor’s name).
2. GET /doctors/:id: Get doctor profile details by ID.
3. PUT /doctors/:id: Update doctor profile details (e.g., name, specialty, experience, location).
4. POST /doctors/:id/availability: Set availability slots for a doctor.
5. GET /doctors/availability/:id: Get available time slots for a specific doctor.

Appointment Booking System
1. GET /appointments: Get all appointments of the logged-in patient or doctor.
2. POST /appointments: Book a new appointment (verify availability and concurrency).
3. PUT /appointments/:id/cancel: Cancel an appointment.
4. GET /appointments/:id: Get details of a specific appointment (for both patient and doctor).
5. POST /appointments/:id/confirm: Confirm an appointment (doctor confirms the patient's booking).
6. GET /appointments/available-slots: Get available time slots for booking based on the doctor’s availability.

Notification System
1. POST /notifications/send: Trigger email notifications for booking, cancellation, or reminders (handled by the backend).

---

2. Database Schema Design

Tables (Collections in MongoDB)
1. Users Collection
    - `_id`: ObjectId (Primary Key)
    - `role`: String ('doctor', 'patient')
    - `email`: String (unique)
    - `passwordHash`: String (hashed password)
    - `name`: String
    - `phone`: String (optional)
    - `address`: String (optional)
    - `createdAt`: Date
    - `updatedAt`: Date

2. Doctors Collection
    - `_id`: ObjectId (Primary Key)
    - `userId`: ObjectId (Reference to Users)
    - `specialty`: String (e.g., Cardiologist)
    - `experienceYears`: Number (e.g., 5)
    - `location`: String (City, State)
    - `availability`: [Array of availability objects] (e.g., [{ day: 'Monday', slots: ['9:00 AM - 10:00 AM', '2:00 PM - 3:00 PM'] }])
    - `createdAt`: Date
    - `updatedAt`: Date

3. Appointments Collection
    - `_id`: ObjectId (Primary Key)
    - `patientId`: ObjectId (Reference to Users)
    - `doctorId`: ObjectId (Reference to Doctors)
    - `date`: Date
    - `timeSlot`: String (e.g., '9:00 AM - 10:00 AM')
    - `status`: String ('booked', 'completed', 'cancelled', 'confirmed')
    - `createdAt`: Date
    - `updatedAt`: Date

4. Notifications Collection (Optional if notifications are stored separately)
    - `_id`: ObjectId (Primary Key)
    - `userId`: ObjectId (Reference to Users)
    - `type`: String ('appointment_booking', 'appointment_cancellation', etc.)
    - `message`: String
    - `isRead`: Boolean (Whether the user has read it)
    - `createdAt`: Date

---

3. Systems Required

Authentication System
- JWT-based Authentication: Each type of user doctor/patient
- Password Hashing: Use bcrypt.js to store in db
- Role-based Authorization: Different routes should be protected based on user roles (doctor vs. patient), ensuring that doctors can only access doctor-related routes and vice versa.

Availability System: Doctors set their availability for the week. set of time slots (e.g., 9:00 AM - 10:00 AM) within specific days (e.g., Monday). backend validate the availability during appointment creation and prevent double-booking.
  
Concurrency Handling: MongoDB Transactions

Email Notification System: Nodemailer Integration: email notifications for booking confirmation, cancellation.

---

4. Utility Functions

- Password Hashing & Comparison: Functions to hash passwords on registration and compare hashed passwords during login.
- Token Creation & Verification: Functions for creating and verifying JWT tokens for authentication.
- Date & Time Utilities: Functions to validate time slots (e.g., ensuring that the time slot is in the future).
- Availability Slot Validator: A function to check if a particular slot is available or already booked.
- Email Notification Handler: A utility for composing and sending emails using Nodemailer (e.g., sending booking confirmations or cancellations).

---

Backend Architecture Overview
- Express.js: Framework to handle routes and API requests.
- MongoDB: NoSQL database to store user, doctor, and appointment data.
- JWT: Authentication mechanism for secure login sessions.
- Nodemailer: Email notification system for booking confirmations and cancellations.
- Bcrypt.js: Secure password hashing library for safe password management.
- Mongoose: ODM for MongoDB to interact with the database in a structured way.

</technical_specification>

<task>
Write code for this application
</task>