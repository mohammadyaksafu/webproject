import React, { useState } from "react";
import { Phone, Mail, MapPin, User, Building2, Clock, Send } from "lucide-react";

export default function Contact() {
  const [selectedHall, setSelectedHall] = useState(0);

const halls = [
    {
      name: "Shah Paran Hall (SHPH)",
      provost: "Dr. Mohammad Ali",
      email: "shph-provost@sust.edu",
      phone: "+8801712226601",
      office: "Ground Floor, SHPH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Bijoy 24 Hall (B24H)",
      provost: "Dr. Rahman Khan",
      email: "b24h-provost@sust.edu",
      phone: "+8801712226602",
      office: "1st Floor, B24H Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Syed Mujtaba Ali Hall (SMAH)",
      provost: "Dr. Fatima Begum",
      email: "smah-provost@sust.edu",
      phone: "+8801712226603",
      office: "Ground Floor, SMAH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Ayesha Siddiqa Hall (ASH)",
      provost: "Dr. Ahmed Hussain",
      email: "ash-provost@sust.edu",
      phone: "+8801712226604",
      office: "2nd Floor, ASH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)",
      image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Begum Sirajunnesa Chowdhury Hall (BSCH)",
      provost: "Dr. Nusrat Jahan",
      email: "bsch-provost@sust.edu",
      phone: "+8801712226605",
      office: "Ground Floor, BSCH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)",
      image: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Fatimah Tuz Zahra Hall (FTZH)",
      provost: "Dr. Sabrina Chowdhury",
      email: "ftzh-provost@sust.edu",
      phone: "+8801712226606",
      office: "1st Floor, FTZH Building",
      officeHours: "10:00 AM - 4:00 PM (Sat-Thu)",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const emergencyContacts = [
    { name: "Campus Security", phone: "+8801712229999" },
    { name: "Medical Emergency", phone: "+8801712228888" },
    { name: "IT Support", phone: "+8801712227777" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#00df9a] to-green-500 rounded-full mb-6">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hall Administration Contact
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get in touch with your hall administration for any queries, issues, or support. 
            Our dedicated team is here to help you with hall-related matters.
          </p>
        </div>

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
                    key={index}
                    onClick={() => setSelectedHall(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedHall === index
                        ? 'bg-gradient-to-r from-[#00df9a] to-green-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="font-semibold text-sm">{hall.name}</div>
                    <div className={`text-xs mt-1 ${
                      selectedHall === index ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      {hall.provost}
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
                  src={halls[selectedHall].image}
                  alt={halls[selectedHall].name}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-3xl font-bold text-white text-center px-4">
                    {halls[selectedHall].name}
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
                      {halls[selectedHall].provost}
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
                      {halls[selectedHall].officeHours}
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
                        href={`tel:${halls[selectedHall].phone}`}
                        className="text-lg font-bold text-gray-900 hover:text-[#00df9a] transition-colors duration-200"
                      >
                        {halls[selectedHall].phone}
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
                        href={`mailto:${halls[selectedHall].email}`}
                        className="text-lg font-bold text-gray-900 hover:text-[#00df9a] transition-colors duration-200 break-all"
                      >
                        {halls[selectedHall].email}
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
                        {halls[selectedHall].office}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href={`tel:${halls[selectedHall].phone}`}
                    className="flex-1 bg-gradient-to-r from-[#00df9a] to-green-500 text-white py-4 px-6 rounded-xl font-bold text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </a>
                  <a
                    href={`mailto:${halls[selectedHall].email}`}
                    className="flex-1 border-2 border-[#00df9a] text-[#00df9a] py-4 px-6 rounded-xl font-bold text-center hover:bg-[#00df9a] hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Email
                  </a>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="mt-8 bg-gradient-to-r from-[#00df9a] to-green-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Important Notes</h3>
              <ul className="space-y-2 text-white/90">
                <li>• Always use your SUST email for official communication</li>
                <li>• Include your student ID and hall name in all correspondence</li>
                <li>• For urgent matters, visit the hall office during office hours</li>
                <li>• Emergency contacts are available 24/7 for critical situations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}