import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, Calendar } from 'lucide-react';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import type { Doctor } from '../types';

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: doctor, isLoading } = useQuery<Doctor>({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center">Loading doctor profile...</div>;
  }

  if (!doctor) {
    return <div className="text-center">Doctor not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{doctor.userId.name}</CardTitle>
          <div className="text-lg text-gray-600">{doctor.specialty}</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-500" />
                  <span>{doctor.experienceYears} years of experience</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Availability</h3>
              <div className="space-y-4">
                {doctor.availability.map((avail) => (
                  <div key={avail._id} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{avail.day}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {avail.slots.map((slot, index) => (
                        <div
                          key={index}
                          className="text-sm bg-gray-50 rounded px-2 py-1 text-center"
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={() => navigate(`/book-appointment/${doctor._id}`)}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}