# Clinic360 - Healthcare Appointment Booking System

## Overview

clinic360 is a web-based healthcare appointment booking platform that connects patients with doctors. The application enables patients to search for specialists, book appointments, and manage their healthcare journey. Doctors can manage their profiles, set availability, and view upcoming appointments.

## Features

### For Patients
- **User Authentication**: Secure JWT-based authentication
- **Doctor Search**: Filter doctors by specialty, location, and name
- **Appointment Booking**: Book available slots with preferred doctors
- **Appointment Management**: View and cancel appointments as needed
- **Email Notifications**: Receive confirmation emails for all appointment actions

### For Doctors
- **Profile Management**: Create and update professional profiles with specialties and experience
- **Availability Settings**: Define working hours and consultation slots
- **Multiple Locations**: Set up multiple consultation locations
- **Appointment Dashboard**: View and manage upcoming appointments

## Tech Stack

- **Frontend**:
  - React.js with React Router
  - Redux or Context API for state management
  - ShadCN UI components
  - Tailwind CSS for styling
  - Framer Motion for animations

- **Backend**:
  - Node.js with Express
  - MongoDB for database
  - JWT for authentication
  - Nodemailer for email notifications

---
## Api documentations

[Documentation](./api_documentation.md)

**Routes**
```
/api/auth/register/patient**
/api/auth/register/doctor**
/api/auth/login**
/api/auth/me**
/api/doctors**
/api/doctors/:id**
/api/doctors/:id**
/api/doctors/:id/availability**
/api/doctors/availability/:id**
/api/appointments**
/api/appointments**
/api/appointments/available-slots**
/api/appointments/:id**
/api/appointments/:id/cancel**
/api/appointments/:id/confirm**
```

---

## Project Structure

**Frontend**

```
.
├── bun.lockb
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   └── docwithpatient.png
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── ui
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       └── tabs.tsx
│   ├── index.css
│   ├── lib
│   │   ├── axios.ts
│   │   └── utils.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── AppointmentBooking.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── DoctorSearch.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Login.tsx
│   │   ├── PatientDashboard.tsx
│   │   └── Register.tsx
│   ├── store
│   │   └── auth.ts
│   ├── types
│   │   └── index.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

9 directories, 40 files
```

**Backend**

```
.
├── bun.lockb
├── config
│   ├── config.js
│   └── db.js
├── controllers
│   ├── appointmentController.js
│   ├── authController.js
│   ├── doctorController.js
│   └── notificationController.js
├── example.env
├── middleware
│   ├── auth.js
│   └── roleCheck.js
├── models
│   ├── Appointment.js
│   ├── Doctor.js
│   ├── Notification.js
│   └── User.js
├── package.json
├── package-lock.json
├── routes
│   ├── appointmentRoutes.js
│   ├── authRoutes.js
│   ├── doctorRoutes.js
│   └── notificationRoutes.js
├── server.js
└── utils
    ├── emailService.js
    └── timeSlotValidator.js

7 directories, 23 files
```

## Pages Architecture

### Patient Pages
1. **Landing Page**: Introduction to the platform and authentication options
2. **Authentication Pages**: Login and registration
3. **Doctor Search Page**: Search for doctors using filters
4. **Doctor Profile Page**: View doctor details and availability
5. **Appointment Booking Page**: Select and confirm appointment slots
6. **Appointment Management Page**: View and manage upcoming appointments

### Doctor Pages
1. **Doctor Dashboard**: Overview of appointments and profile status
2. **Profile Management Page**: Update professional information
3. **Availability Settings Page**: Set working hours and consultation slots
4. **Appointment Management Page**: View and manage patient appointments

## Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/1447bits/clinic360.git
   cd clinic360
   ```

2. Install server dependencies
   ```bash
   cd backend
   npm install
   ```

   (and)

   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables
   ```bash
   # In server directory, create a .env file with:
   
   MONGO_URI=<MONGO_URI>
   JWT_SECRET=<JWT_SECRET>
   JWT_EXPIRES_IN=<JWT_EXPIRES_IN>

   EMAIL_USER=<EMAIL_USER>
   EMAIL_PASS=<EMAIL_PASS>
   EMAIL_HOST=<EMAIL_HOST>
   EMAIL_PORT=<EMAIL_PORT>
   EMAIL_FROM=<EMAIL_FROM>

   ```

### Running the Application

1. Start the server
   **Frontend**
   ```bash
   # In the frontend directory
   npm run dev
   ```

   **backend**
   ```bash
   # In the frontend directory
   node server.js
   ```

## Development Workflow

1. **Authentication & Role Management**
   - Implement JWT-based authentication
   - Create user registration and login flows for both roles

2. **Doctor Profile Management**
   - Create doctor profile pages
   - Implement profile editing functionality

3. **Search Functionality**
   - Implement doctor search with filters
   - Create search results listing page

4. **Appointment System**
   - Create appointment booking functionality
   - Implement availability settings for doctors
   - Develop appointment management for both roles

5. **Email Notifications**
   - Implement email notifications for appointment actions

## Deployment

### Frontend Deployment
- Build the React application
  ```bash
  cd frontend
  npm run build
  ```
- Deploy the build folder to a static hosting service like Netlify, Vercel, or AWS S3

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

**Backend**

- [Express js](https://expressjs.com/) for backend server
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
- [mongoosejs](https://mongoosejs.com/) for accessing mongoDB database
- [nodemailer](https://www.nodemailer.com/) for setting up smtp sending email
- 
**Frontend**

- [ShadCN UI](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React JS](https://react.dev/) for frontend website
- [zod](https://zod.dev/) for validations
- [zustand](https://zustand-demo.pmnd.rs/) for state management
- [tanstack](https://tanstack.com/query/latest) for querying backend
- [tanstack](https://tanstack.com/query/latest) for querying backend