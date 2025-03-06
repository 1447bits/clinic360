import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, Calendar, Search, User, MapPin } from "lucide-react";
import coverImage from '/docwithpatient.png'

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Find the Right Doctor",
      description: "Search for specialists by name, specialty, or location.",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Book Appointments",
      description: "Schedule appointments at your convenience.",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Manage Your Health",
      description: "Track appointments and medical history in one place.",
      icon: <User className="h-6 w-6" />,
    },
    {
      title: "Multiple Locations",
      description: "Find doctors near you with multiple consultation locations.",
      icon: <MapPin className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Healthcare at Your <span className="text-blue-600">Fingertips</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Book appointments with specialists, manage your health journey, and connect with healthcare professionals - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={coverImage}
              alt="Doctor with Patient"
              className="rounded-xl shadow-lg w-full max-w-[500px] h-auto"
            />
          </motion.div>
        </div>
      </section>

      <div className="w-full flex justify-center items-center">

        <Button
          size="lg"
          className="bg-black mx-auto hover:bg-gray-800 text-white w-full sm:w-auto"
          onClick={() => navigate("/home")}
        >
          Search Doctors
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to find doctors, book appointments, and manage your healthcare needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-50 rounded-full mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* User Types Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-white rounded-t-3xl">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            For Patients and Doctors
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 p-8 rounded-xl"
          >
            <h3 className="text-2xl font-bold text-blue-700 mb-4">For Patients</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Search for doctors by specialty, location, or name</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Book appointments at your convenience</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Manage and cancel appointments if needed</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Receive email confirmations for all appointment actions</span>
              </li>
            </ul>
            <div className="mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate("/register?role=patient")}
                >
                  Register as Patient
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 p-8 rounded-xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">For Doctors</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Create and manage your professional profile</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Set your availability and working hours</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>Define multiple consultation locations</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span>View and manage upcoming appointments</span>
              </li>
            </ul>
            <div className="mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate("/register?role=doctor")}
                >
                  Register as Doctor
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Clinic360</h2>
              <p className="text-gray-400 mt-2">Healthcare at your fingertips</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Contact Us
              </Button>
              <a href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} <a href="https://github.com/1447bits">1447bits</a>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;