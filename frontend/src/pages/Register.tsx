import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/auth';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
});

const patientSchema = baseSchema;

const doctorSchema = baseSchema.extend({
  specialty: z.string().min(1, 'Specialty is required'),
  experienceYears: z.number().min(0, 'Experience years must be positive'),
  location: z.string().min(1, 'Location is required'),
});

type PatientForm = z.infer<typeof patientSchema>;
type DoctorForm = z.infer<typeof doctorSchema>;

const specialties = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Psychiatry',
  'Orthopedics',
];

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  const patientForm = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
  });

  const doctorForm = useForm<DoctorForm>({
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit = async (data: PatientForm | DoctorForm) => {
    try {
      const response = await api.post(`/auth/register/${role}`, data);
      const { token, user } = response.data;
      setAuth(token, user);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

      <Tabs value={role} onValueChange={(value) => setRole(value as 'patient' | 'doctor')}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="patient" className="flex-1">Patient</TabsTrigger>
          <TabsTrigger value="doctor" className="flex-1">Doctor</TabsTrigger>
        </TabsList>

        <TabsContent value="patient">
          <form onSubmit={patientForm.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...patientForm.register('name')}
                className={patientForm.formState.errors.name ? 'border-red-500' : ''}
              />
              {patientForm.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{patientForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...patientForm.register('email')}
                className={patientForm.formState.errors.email ? 'border-red-500' : ''}
              />
              {patientForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{patientForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...patientForm.register('password')}
                className={patientForm.formState.errors.password ? 'border-red-500' : ''}
              />
              {patientForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{patientForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...patientForm.register('phone')}
                className={patientForm.formState.errors.phone ? 'border-red-500' : ''}
              />
              {patientForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{patientForm.formState.errors.phone.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={patientForm.formState.isSubmitting}>
              {patientForm.formState.isSubmitting ? 'Registering...' : 'Register as Patient'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="doctor">
          <form onSubmit={doctorForm.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...doctorForm.register('name')}
                className={doctorForm.formState.errors.name ? 'border-red-500' : ''}
              />
              {doctorForm.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{doctorForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...doctorForm.register('email')}
                className={doctorForm.formState.errors.email ? 'border-red-500' : ''}
              />
              {doctorForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{doctorForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...doctorForm.register('password')}
                className={doctorForm.formState.errors.password ? 'border-red-500' : ''}
              />
              {doctorForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{doctorForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...doctorForm.register('phone')}
                className={doctorForm.formState.errors.phone ? 'border-red-500' : ''}
              />
              {doctorForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{doctorForm.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Select
                onValueChange={(value) => doctorForm.setValue('specialty', value)}
                defaultValue={doctorForm.watch('specialty')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {doctorForm.formState.errors.specialty && (
                <p className="text-red-500 text-sm mt-1">{doctorForm.formState.errors.specialty.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="experienceYears">Years of Experience</Label>
              <Input
                id="experienceYears"
                type="number"
                {...doctorForm.register('experienceYears', { valueAsNumber: true })}
                className={doctorForm.formState.errors.experienceYears ? 'border-red-500' : ''}
              />
              {doctorForm.formState.errors.experienceYears && (
                <p className="text-red-500 text-sm mt-1">{doctorForm.formState.errors.experienceYears.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...doctorForm.register('location')}
                className={doctorForm.formState.errors.location ? 'border-red-500' : ''}
              />
              {doctorForm.formState.errors.location && (
                <p className="text-red-500 text-sm mt-1">{doctorForm.formState.errors.location.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={doctorForm.formState.isSubmitting}>
              {doctorForm.formState.isSubmitting ? 'Registering...' : 'Register as Doctor'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}