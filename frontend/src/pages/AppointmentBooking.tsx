import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import api from '../lib/axios';
import type { Doctor } from '../types';

export default function AppointmentBooking() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: doctor } = useQuery<Doctor>({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    },
  });

  const { data: availableSlots = [] } = useQuery<string[]>({
    queryKey: ['available-slots', doctorId, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const response = await api.get('/appointments/available-slots', {
        params: {
          doctorId,
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });
      return response.data.availableSlots;
    },
    enabled: !!selectedDate,
  });

  const bookAppointment = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedSlot) return;
      return api.post('/appointments', {
        doctorId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedSlot,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      navigate('/patient/dashboard');
    },
  });

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Book Appointment with Dr. {doctor.userId.name}</CardTitle>
          <div className="text-gray-600">{doctor.specialty}</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
              {selectedDate ? (
                availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        onClick={() => setSelectedSlot(slot)}
                        className="w-full"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No available slots for this date</div>
                )
              ) : (
                <div className="text-gray-500">Please select a date first</div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              className="w-full md:w-auto bg-black text-white"
              disabled={!selectedDate || !selectedSlot || bookAppointment.isPending}
              onClick={() => bookAppointment.mutate()}
            >
              {bookAppointment.isPending ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}