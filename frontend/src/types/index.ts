export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'doctor' | 'patient';
  address: string,
  createdAt: string,
  phone: string,
  updatedAt: string,
  __v: number
}

export interface Doctor {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
  };
  specialty: string;
  experienceYears: number;
  location: string;
  availability: Availability[];
}

export interface Availability {
  _id: string;
  day: string;
  slots: string[];
}

export interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  doctorId: {
    _id: string;
    specialty: string;
    location: string;
    userId: {
      _id: string;
      name: string;
      email: string;
    };
  };
  date: string;
  timeSlot: string;
  duration: number;
  status: 'booked' | 'confirmed' | 'cancelled';
}