import React from "react";
import { Users, MapPin, Building2, Star, Wifi, Utensils, BookOpen, Phone, Mail } from "lucide-react";

export default function AboutHall() {
  const halls = [
    {
      name: "Shah Paran Hall (SHPH)",
      fullName: "Shah Paran Hall",
      type: "Male",
      capacity: "400+ students",
      facilities: ["Wi-Fi", "Common Room", "Dining", "Library", "Sports"],
      description: "One of the premier male residential halls with modern amenities and excellent facilities.",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-blue-500 to-cyan-500",
      provost: "Dr. Mohammad Ali",
      email: "shph-provost@sust.edu",
      phone: "+8801712226601",
      office: "Ground Floor, SHPH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)"
    },
    {
      name: "Bijoy 24 Hall (B24H)",
      fullName: "Bijoy 24 Hall",
      type: "Male",
      capacity: "350+ students",
      facilities: ["Wi-Fi", "Gym", "Dining", "Sports", "Common Room"],
      description: "Comfortable accommodation with recreational facilities and spacious common areas.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-green-500 to-emerald-500",
      provost: "Dr. Rahman Khan",
      email: "b24h-provost@sust.edu",
      phone: "+8801712226602",
      office: "1st Floor, B24H Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)"
    },
    {
      name: "Syed Mujtaba Ali Hall (SMAH)",
      fullName: "Syed Mujtaba Ali Hall",
      type: "Female",
      capacity: "300+ students",
      facilities: ["Wi-Fi", "Common Room", "Dining", "Security", "Study Room"],
      description: "Secure and peaceful environment for female students with modern amenities.",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-purple-500 to-pink-500",
      provost: "Dr. Fatima Begum",
      email: "smah-provost@sust.edu",
      phone: "+8801712226603",
      office: "Ground Floor, SMAH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)"
    },
    {
      name: "Ayesha Siddiqa Hall (ASH)",
      fullName: "Ayesha Siddiqa Hall",
      type: "Female",
      capacity: "320+ students",
      facilities: ["Wi-Fi", "Library", "Dining", "Common Room", "Gardens"],
      description: "Modern facilities with spacious rooms and excellent study environment.",
      image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-orange-500 to-red-500",
      provost: "Dr. Ahmed Hussain",
      email: "ash-provost@sust.edu",
      phone: "+8801712226604",
      office: "2nd Floor, ASH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)"
    },
    {
      name: "Begum Sirajunnesa Chowdhury Hall (BSCH)",
      fullName: "Begum Sirajunnesa Chowdhury Hall",
      type: "Female",
      capacity: "280+ students",
      facilities: ["Wi-Fi", "Common Room", "Dining", "Study Room", "Security"],
      description: "Comfortable residential facility with dedicated study areas and modern amenities.",
      image: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-indigo-500 to-purple-500",
      provost: "Dr. Nusrat Jahan",
      email: "bsch-provost@sust.edu",
      phone: "+8801712226605",
      office: "Ground Floor, BSCH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)"
    },
    {
      name: "Fatimah Tuz Zahra Hall (FTZH)",
      fullName: "Fatimah Tuz Zahra Hall",
      type: "Female",
      capacity: "250+ students",
      facilities: ["Wi-Fi", "Common Room", "Dining", "Gardens", "Study Room"],
      description: "Beautiful residential hall with green surroundings and peaceful atmosphere.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "from-teal-500 to-blue-500",
      provost: "Dr. Sabrina Chowdhury",
      email: "ftzh-provost@sust.edu",
      phone: "+8801712226606",
      office: "1st Floor, FTZH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)"
    }
  ];

  const facilityIcons = {
    "Wi-Fi": <Wifi className="h-4 w-4" />,
    "Common Room": <Users className="h-4 w-4" />,
    "Dining": <Utensils className="h-4 w-4" />,
    "Library": <BookOpen className="h-4 w-4" />,
    "Gym": <Star className="h-4 w-4" />,
    "Sports": <Star className="h-4 w-4" />,
    "Security": <Star className="h-4 w-4" />,
    "Study Room": <BookOpen className="h-4 w-4" />,
    "Gardens": <MapPin className="h-4 w-4" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#00df9a] to-green-500 rounded-full mb-6">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About SUST Halls
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Shahjalal University of Science & Technology provides comfortable and modern residential 
            facilities for students. Explore our six halls with state-of-the-art amenities and 
            vibrant campus life.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">6</div>
            <div className="text-gray-600 font-medium">Residential Halls</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">1,900+</div>
            <div className="text-gray-600 font-medium">Student Capacity</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Support & Security</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">2:4</div>
            <div className="text-gray-600 font-medium">Male:Female Ratio</div>
          </div>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {halls.map((hall, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              {/* Hall Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hall.image}
                  alt={hall.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${hall.color} opacity-20`}></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hall.type === "Male" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-pink-100 text-pink-800"
                  }`}>
                    {hall.type}
                  </span>
                </div>
              </div>

              {/* Hall Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{hall.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{hall.description}</p>
                
                {/* Capacity */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Capacity: {hall.capacity}</span>
                </div>

                {/* Contact Info */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{hall.phone}</span>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Facilities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {hall.facilities.map((facility, idx) => (
                      <div
                        key={idx}
                        className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-200"
                      >
                        {facilityIcons[facility]}
                        <span className="ml-1">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Button */}
                <button className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-2 rounded-lg font-semibold hover:from-[#00df9a] hover:to-green-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Administration
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-gradient-to-r from-[#00df9a] to-green-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need More Information?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Contact the Hall Administration office for detailed information about seat availability, 
            allocation process, and specific hall regulations.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto">
            <Phone className="h-5 w-5 mr-2" />
            Contact Hall Administration
          </button>
        </div>
      </div>
    </div>
  );
}