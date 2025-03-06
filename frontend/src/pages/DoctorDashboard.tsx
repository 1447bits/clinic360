import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../lib/axios';
import type { Appointment } from '../types';
import { useAuthStore } from '../store/auth';

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function DoctorDashboard() {

  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const { user: profile } = useAuthStore()
  console.log(profile)

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await api.get('/appointments');
      return response.data;
    },
  });

  const updateAvailability = useMutation({
    mutationFn: async () => {
      return api.post(`/doctors/${profile?._id}/availability`, {
        availability: [{
          day: selectedDay,
          slots: selectedSlots,
        }],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
    },
  });

  const confirmAppointment = useMutation({
    mutationFn: async (appointmentId: string) => {
      return api.post(`/appointments/${appointmentId}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const handleSlotToggle = (slot: string) => {
    setSelectedSlots((current) =>
      current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

      <Tabs defaultValue="appointments">
        <TabsList className="mb-8">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="availability">Manage Availability</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No appointments scheduled</p>
                </CardContent>
              </Card>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Appointment with {appointment.patientId.name}</span>
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm ${appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{appointment.patientId.phone}</span>
                        </div>
                      </div>
                      {appointment.status === 'booked' && (
                        <div className="flex items-center justify-end">
                          <Button
                            onClick={() => confirmAppointment.mutate(appointment._id)}
                            disabled={confirmAppointment.isPending}
                          >
                            Confirm Appointment
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Set Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Select Day</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-5 mt-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlots.includes(slot) ? 'default' : 'outline'}
                        onClick={() => handleSlotToggle(slot)}
                        className={`w-full  ${selectedSlots.includes(slot) ? "shadow-sm border-2 border-gray-300" : "shadow-none"}`}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => updateAvailability.mutate()}
                  disabled={updateAvailability.isPending}
                  className="w-full md:w-auto bg-black text-white"
                >
                  {updateAvailability.isPending ? 'Updating...' : 'Update Availability'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {profile && (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <div className="text-lg">{profile.name}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="text-lg">{profile.email}</div>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <div className="text-lg">{profile.address}</div>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <div className="text-lg">{profile.phone}</div>
                  </div>
                  <div>
                    <Label>Joined At</Label>
                    <div className="text-lg">{new Date(profile.createdAt).toDateString()}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

