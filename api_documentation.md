## Authentication & Role Management

1. **POST /api/auth/register/patient**
- **Description**: Register a new patient.
- **Request Body**:
  ```json
  { "email": "string", "password": "string", "name": "string", "phone": "string", "address": "string" }
  ```
- **Response**:
  - **200**: `{ "token": "string" }`
  - **400**: `{ "message": "User already exists" }`
  - **500**: `{ "message": "Server error" }`

---

2. **POST /api/auth/register/doctor**
- **Description**: Register a new doctor.
- **Request Body**:
  ```json
  { "email": "string", "password": "string", "name": "string", "phone": "string", "address": "string", "specialty": "string", "experienceYears": "number", "location": "string" }
  ```
- **Response**:
  - **200**: `{ "token": "string" }`
  - **400**: `{ "message": "User already exists" }`
  - **500**: `{ "message": "Server error" }`

---

3. **POST /api/auth/login**
- **Description**: Log in for both patients and doctors.
- **Request Body**:
  ```json
  { "email": "string", "password": "string" }
  ```
- **Response**:
  - **200**: `{ "token": "string" }`
  - **400**: `{ "message": "Invalid credentials" }`
  - **500**: `{ "message": "Server error" }`

---

4. **GET /api/auth/me**
- **Description**: Get logged-in user details.
- **Headers**: `x-auth-token: JWT_TOKEN`
- **Response**:
  - **200**: `{ "id": "string", "email": "string", "role": "string", "name": "string", "phone": "string", "address": "string" }`
  - **500**: `{ "message": "Server error" }`

## Doctor Search & Profile Management

1. **GET /api/doctors**
- **Description**: Search for doctors using optional filters (specialty, location, name).
- **Query Parameters**:
  - **specialty**: Filter by doctor's specialty (e.g., Cardiology).
  - **location**: Filter by location (e.g., New York).
  - **name**: Filter by doctor's name (e.g., Dr. Smith).
  
Response:
- **200**: List of doctors matching the filters.
  ```json
    [
      {
        _id: string;
        userId: {
            _id: string;
            email: string;
            name: string;
        };
        specialty: string;
        experienceYears: number;
        location: string;
        availability: string[]; 
        createdAt: string; 
        updatedAt: string; 
        __v: number;
      }
    ]
  ```
- **500**: `{ "message": "Server error" }`

---

2. **GET /api/doctors/:id**
- **Description**: Get a doctor's profile by ID.
  
Response:
- **200**: Doctor profile details.
  ```json
   {
    _id: string;
    userId: {
        _id: string;
        email: string;
        name: string;
        phone: string;
    };
    specialty: string;
    experienceYears: number;
    location: string;
    availability: string[]; 
    createdAt: string; 
    updatedAt: string; 
    __v: number;
  }
  ```
- **404**: `{ "message": "Doctor not found" }`
- **500**: `{ "message": "Server error" }`

---

1. **PUT /api/doctors/:id**
- **Description**: Update doctor profile details (e.g., specialty, experience, location). **Doctor only**.

Header: `x-auth-token: JWT_TOKEN`
  
Request Body:
```json
{
  "specialty": "string",
  "experienceYears": "number",
  "location": "string"
}
```
  
Response:
- **200**: Updated doctor profile.
  ```json
    {
      _id: string;
      userId: string; 
      specialty: string;
      experienceYears: number;
      location: string;
      availability: string[]; 
      createdAt: string; 
      updatedAt: string; 
      __v: number;
    }
  ```
- **403**: `{ "message": "Not authorized to update this profile" }`
- **404**: `{ "message": "Doctor not found" }`
- **500**: `{ "message": "Server error" }`

---

4. **POST /api/doctors/:id/availability**
- **Description**: Set availability slots for a doctor. **Doctor only**.

- **Headers**: `x-auth-token: JWT_TOKEN`

  
Request Body:
```json
{
  "availability": [{
    day: string;
    slots: string[]; //
  }]
}
```
- **availability**: Array of available time slots (e.g., `{availability: [{day: "Monday",slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"]}]}`).

Response:
- **200**: Updated availability slots.
  ```json
  [{
    _id: string;
    day: string;
    slots: string[];
  }]
  ```
- **404**: `{ "message": "Doctor profile not found" }`
- **500**: `{ "message": "Server error" }`

---

5. **GET /api/doctors/availability/:id**
- **Description**: Get available time slots for a specific doctor.

- **Headers**: `x-auth-token: JWT_TOKEN`
  
Response:
- **200**: List of availability slots.
  ```json
  [{
    _id: string;
    day: string;
    slots: string[];
  }]
  ```
- **404**: `{ "message": "Doctor not found" }`
- **500**: `{ "message": "Server error" }`


## Appointment Booking System


1. **GET /api/appointments**
- **Description**: Retrieve all appointments for the logged-in user (either a patient or a doctor). The response will include details about each appointment, including the associated doctor and patient information.

**Response:**
- **200**: Successful retrieval of appointments.
  ```json
  [
      {
          "_id": "appointmentId",
          "patientId": {
              "_id": "patientId",
              "name": "Patient Name",
              "email": "patient@example.com",
              "phone": "123-456-7890"
          },
          "doctorId": {
              "_id": "doctorId",
              "specialty": "Doctor Specialty",
              "location": "Doctor Location",
              "userId": {
                  "_id": "doctorUser Id",
                  "name": "Doctor Name",
                  "email": "doctor@example.com"
              }
          },
          "date": "2023-10-01T00:00:00.000Z",
          "timeSlot": "10:00 AM - 10:30 AM",
          "duration": 30,
          "status": "booked"
      },
      ...
  ]
  ```
- **500**: `{ "message": "Server error", "error": "Error message" }`

---

2. **POST /api/appointments**
- **Description**: Book a new appointment. The request must include the doctor ID, date, and time slot. The appointment will be created if the provided details are valid and the time slot is available.

**Headers**: `x-auth-token: JWT_TOKEN`

**Request Body:**
```json
{
    "doctorId": "doctorId",
    "date": "2023-10-01",
    "timeSlot": "10:00 AM - 10:30 AM"
}
```

**Response:**
- **201**: Appointment successfully booked.
  ```json
  {
      "message": "Appointment booked successfully",
      "appointment": {
          "_id": "appointmentId",
          "patientId": "patientId",
          "doctorId": "doctorId",
          "date": "2023-10-01T00:00:00.000Z",
          "timeSlot": "10:00 AM - 10:30 AM",
          "duration": 30,
          "status": "booked"
      }
  }
  ```
- **400**: `{ "message": "All fields are required" }`
- **404**: `{ "message": "Doctor not found" }`
- **500**: `{ "message": "Server error", "error": "Error message" }`

---

3. **GET /api/appointments/available-slots**
- **Description**: Retrieve available time slots for a specific doctor on a given date. The request must include the doctor ID and date.

**Request Query Parameters:**
- `doctorId`: The ID of the doctor.
- `date`: The date for which to check availability.

**Headers**: `x-auth-token: JWT_TOKEN`

**Response:**
- **200**: Available time slots for the specified doctor and date.
  ```json
  {
      "availableSlots": [
          "10:00 AM - 10:30 AM",
          "11:00 AM - 11:30 AM"
      ]
  }
  ```
- **400**: `{ "message": "Doctor ID and date are required" }`
- **404**: `{ "message": "Doctor not found" }`
- **500**: `{ "message": "Server error", "error": "Error message" }`

---

4. **GET /api/appointments/:id**
- **Description**: Retrieve details of a specific appointment by its ID. The response will include information about the doctor and patient associated with the appointment.

**Headers**: `x-auth-token: JWT_TOKEN`

**Response:**
- **200**: Successful retrieval of the appointment.
  ```json
  {
      "_id": "appointmentId",
      "patientId": {
          "_id": "patientId",
          "name": "Patient Name",
          "email": "patient@example.com",
          "phone": "123-456-7890"
      },
      "doctorId": {
          "_id": "doctorId",
          "specialty": "Doctor Specialty",
          "location": "Doctor Location",
          "userId": {
              "_id": "doctorUser Id",
              "name": "Doctor Name",
              "email": "doctor@example.com"
          }
      },
      "date": "2023-10-01T00:00:00.000Z",
      "timeSlot": "10:00 AM - 10:30 AM",
      "duration": 30,
      "status": "booked"
  }
  ```
- **404**: `{ "message": "Appointment not found" }`
- **500**: `{ "message": "Server error", "error": "Error message" }`

---

5. **PUT /api/appointments/:id/cancel**
- **Description**: Cancel a specific appointment by its ID. The user must have permission to cancel the appointment.

**Headers**: `x-auth-token: JWT_TOKEN`

**Response:**
- **200**: Appointment successfully cancelled.
  ```json
  {
      "message": "Appointment cancelled successfully"
  }
  ```
- **404**: `{ "message": "Appointment not found" }`
- **403**: `{ "message": "Not authorized to cancel this appointment" }`
- **400**: `{ "message": "Cannot cancel appointment that is already cancelled" }`
- **500**: `{ "message": "Server error", "error": "Error message" }`

---

6. **POST /api/appointments/:id/confirm**
- **Description**: Confirm a specific appointment by its ID. Only the associated doctor can confirm the appointment.

**Headers**: `x-auth-token: JWT_TOKEN`

**Response:**
- **200**: Appointment successfully confirmed.
  ```json
  {
      "message": "Appointment confirmed successfully",
      "appointment": {
          "_id": "appointmentId",
          "status": "confirmed"
      }
  }
  ```
- **404**: `{ "message": "Appointment not found" }`
- **403**: `{ "message": "Not authorized to confirm this appointment" }`
- **400**: `{ "message": "Cannot confirm appointment that is already confirmed" }`
- **500**: `{ "message": "Server error", "error": "Error message" }`
