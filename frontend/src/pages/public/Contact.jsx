import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, User, Building2, Clock, Send, Loader2, Eye } from "lucide-react";
import Footer from "../../components/common/Footer";

export default function Contact() {
  const [selectedHall, setSelectedHall] = useState(0);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const emergencyContacts = [
    { name: "Campus Security", phone: "+8801712229999" },
    { name: "Medical Emergency", phone: "+8801712228888" },
    { name: "IT Support", phone: "+8801712227777" }
  ];

  useEffect(() => {
    const fetchHallsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/halls');
        
        if (!response.ok) {
          throw new Error('Failed to fetch halls data');
        }
        
        const hallsData = await response.json();
        setHalls(hallsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching halls data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHallsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00df9a] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading hall information...</p>
        </div>
      </div>
    );
  }

  if (error || halls.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Eye className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-4">{error || "No halls found"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#00df9a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const selectedHallData = halls[selectedHall];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hall Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building2 className="h-6 w-6 mr-2 text-[#00df9a]" />
                Select Hall
              </h2>
              
              <div className="space-y-3">
                {halls.map((hall, index) => (
                  <button
                    key={hall.id || index}
                    onClick={() => setSelectedHall(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedHall === index
                        ? 'bg-gradient-to-r from-[#00df9a] to-green-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="font-semibold text-sm">{hall.hallName} ({hall.hallCode})</div>
                    <div className={`text-xs mt-1 ${
                      selectedHall === index ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      {hall.provost || "TBA"}
                    </div>
                  </button>
                ))}
              </div>

              {/* Emergency Contacts */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-red-500" />
                  Emergency Contacts
                </h3>
                <div className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="font-semibold text-red-800 text-sm">{contact.name}</div>
                      <div className="text-red-600 text-xs">{contact.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Hall Header with Image */}
              <div className="relative h-48 bg-gradient-to-r from-gray-900 to-black">
                <img
                  src={selectedHallData.imageUrl}
                  alt={selectedHallData.hallName}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-3xl font-bold text-white text-center px-4">
                    {selectedHallData.hallName} ({selectedHallData.hallCode})
                  </h2>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Provost Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 ml-3">Hall Provost</h3>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      {selectedHallData.provost || "TBA"}
                    </p>
                    <p className="text-gray-600">Responsible for overall hall management</p>
                  </div>

                  {/* Office Hours */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 ml-3">Office Hours</h3>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      10:00 AM - 4:00 PM (Sat-Thu)
                    </p>
                    <p className="text-gray-600">Visit during office hours for in-person queries</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="bg-[#00df9a] p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-700">Phone Number</h4>
                      <a 
                        href={`tel:${selectedHallData.phone}`}
                        className="text-lg font-bold text-gray-900 hover:text-[#00df9a] transition-colors duration-200"
                      >
                        {selectedHallData.phone || "Not available"}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="bg-[#00df9a] p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-700">Email Address</h4>
                      <a 
                        href={`mailto:${selectedHallData.email}`}
                        className="text-lg font-bold text-gray-900 hover:text-[#00df9a] transition-colors duration-200 break-all"
                      >
                        {selectedHallData.email || "Not available"}
                      </a>
                    </div>
                  </div>

                  {/* Office Location */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="bg-[#00df9a] p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-700">Office Location</h4>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedHallData.officeLocation || "Hall Administration Office"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {selectedHallData.phone && (
                    <a
                      href={`tel:${selectedHallData.phone}`}
                      className="flex-1 bg-gradient-to-r from-[#00df9a] to-green-500 text-white py-4 px-6 rounded-xl font-bold text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now
                    </a>
                  )}
                  {selectedHallData.email && (
                    <a
                      href={`mailto:${selectedHallData.email}`}
                      className="flex-1 border-2 border-[#00df9a] text-[#00df9a] py-4 px-6 rounded-xl font-bold text-center hover:bg-[#00df9a] hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Email
                    </a>
                  )}
                </div>
              </div>
            </div>           
          </div>
        </div>
      <div className="mt-12"></div>
        <Footer />
      </div>
    </div>
  );
}