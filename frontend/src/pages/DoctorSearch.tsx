import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import api from '../lib/axios';
import type { Doctor } from '../types';

const specialties = [
  'All',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Psychiatry',
  'Orthopedics',
];

export default function DoctorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [location, setLocation] = useState('');

  const { data: doctors = [], isLoading } = useQuery<Doctor[]>({
    queryKey: ['doctors', searchTerm, specialty, location],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (specialty !== 'All') params.append('specialty', specialty);
      if (location) params.append('location', location);
      
      const response = await api.get(`/doctors?${params.toString()}`);
      return response.data;
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find a Doctor</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search by doctor name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {specialties.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center text-gray-500">No doctors found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor._id}>
              <CardHeader>
                <CardTitle>{doctor.userId.name}</CardTitle>
                <div className="text-sm text-gray-500">{doctor.specialty}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">{doctor.experienceYears} years experience</span>
                </div>
                <Link to={`/doctors/${doctor._id}`}>
                  <Button className="w-full border-2 border-gray-300 transition-all hover:border-gray-500">View Profile</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}