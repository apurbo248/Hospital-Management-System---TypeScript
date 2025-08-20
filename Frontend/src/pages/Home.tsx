import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
   <>
    <Navbar />
    <div className="font-sans">
    
<section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-screen flex items-center justify-center overflow-hidden">
  {/* Background Shapes */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
<div className="relative z-10 bg-white text-gray-800 px-2 py-2 rounded-full shadow-2xl flex w-[500px] overflow-hidden">
  {/* Left Half */}
  <Link
    to="/doctors"
    className="w-1/2 py-3 rounded-l-full font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition text-center"
  >
    Book Appointment
  </Link>
  {/* Right Half */}
  <button className="w-1/2 py-3 rounded-r-full font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
    Book Health Check
  </button>
</div>


  {/* Bottom Wave */}
  <svg
    className="absolute bottom-0 w-full"
    viewBox="0 0 1440 320"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#ffffff"
      fillOpacity="1"
      d="M0,224L48,197.3C96,171,192,117,288,117.3C384,117,480,171,576,186.7C672,203,768,181,864,165.3C960,149,1056,139,1152,144C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    ></path>
  </svg>
</section>


      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="text-blue-500 text-5xl mb-4">🩺</div>
              <h3 className="font-semibold text-xl mb-2">Expert Doctors</h3>
              <p className="text-gray-600">
                Consult with top healthcare professionals in your city and get personalized care.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="text-green-500 text-5xl mb-4">⏱️</div>
              <h3 className="font-semibold text-xl mb-2">Fast Booking</h3>
              <p className="text-gray-600">
                Book appointments online instantly without waiting in queues.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="text-indigo-500 text-5xl mb-4">💻</div>
              <h3 className="font-semibold text-xl mb-2">Online Records</h3>
              <p className="text-gray-600">
                Keep track of your health records digitally and access them anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Booking Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">General Checkup</h3>
              <p className="text-gray-600">Routine health checkups for all age groups.</p>
            </div>
            <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Pediatrics</h3>
              <p className="text-gray-600">Specialized care for children and newborns.</p>
            </div>
            <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Diagnostics</h3>
              <p className="text-gray-600">Quick lab tests and diagnostics at your convenience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 HealthCare Platform. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>

   </> 
     );
};

export default HomePage;
