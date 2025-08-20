import React, { useEffect, useState } from "react";
import { Search, Phone, CalendarDays, X, Menu } from "lucide-react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getUserByRole } from "../features/auth/authSlice"; 
import type { RootState, AppDispatch } from "../store/store";
import type { DoctorUser } from "../features/auth/authSlice"; // Use role-specific type

export default function FindDoctorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, roleData, loading, error } = useSelector((state: RootState) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
console.log("Users:", users.length);
  // Fetch doctors on mount
  useEffect(() => {
    dispatch(getUserByRole("doctor"));
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find a Doctor</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Connect with Trusted Healthcare Experts for Personalized Care
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full max-w-xl">
              <Search className="text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search for Doctors & Specialities..."
                className="w-full px-3 py-2 text-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex max-w-7xl mx-auto px-4 py-10 gap-8">
          {/* Filters */}
          <aside
            className={`bg-white shadow-lg rounded-lg p-6 w-72 flex-shrink-0 transform transition-transform duration-300 fixed md:static top-0 left-0 h-full md:h-auto z-20 ${
              showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
          >
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>

            <h2 className="text-lg font-semibold mb-4 hidden md:block">Filters</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Specialities</h3>
                <input
                  type="text"
                  placeholder="Search Speciality"
                  className="w-full border rounded-md px-3 py-2 mb-2"
                />
                <ul className="space-y-1 text-sm text-gray-700 max-h-40 overflow-y-auto">
                  <li>Neurosciences</li>
                  <li>Anaesthesiology</li>
                  <li>Bariatrics</li>
                  <li>Cardiac Sciences</li>
                  <li>Dermatology</li>
                  <li>ENT</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Gender</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" /> Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" /> Female
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Doctors List */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{roleData?.total} Doctors</h2>
              <button
                className="md:hidden flex items-center gap-2 border px-3 py-2 rounded-md"
                onClick={() => setShowFilters(true)}
              >
                <Menu size={20} /> Filters
              </button>
              <select className="border rounded-md px-3 py-2">
                <option>Sort by</option>
                <option>Experience</option>
                <option>Name</option>
              </select>
            </div>

            {loading && <p>Loading doctors...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid gap-6">
              {Array.isArray(users) && users
                .filter((u): u is DoctorUser => u.role === "doctor") // Type guard
                .map((doc, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4"
                >
                  {/* Doctor Image Placeholder */}
                  <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    Dr
                  </div>  

                  {/* Doctor Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{doc.name}</h3>
                    
                    <p className="text-sm text-gray-600">
                       {doc.specialization?.join(", ") || "N/A"}  
                    </p>

                    {/* Languages */}
                    {doc.language && doc.language.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Languages:</span> {doc.language.join(", ")}
                      </p>
                    )}

                    {/* Availability
                    {doc.availability && doc.availability.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Availability:</span>
                        <ul className="list-disc list-inside">
                          {doc.availability.map((slot, idx) => (
                            <li key={idx}>
                              {slot.day}: {slot.timeSlots.map(ts => `${ts.start}-${ts.end}`).join(", ")}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )} */}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-2">
                    <button className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
                      <Phone size={18} /> Call
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      <CalendarDays size={18} /> Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
