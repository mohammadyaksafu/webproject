import React from "react";
import { Building2, Users, Calendar, BookOpen, Phone, Shield, Home } from "lucide-react";

const Feature = () => {
  const features = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Hall Overview",
      description: "Explore all SUST halls with detailed information about facilities and amenities.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Rules & Regulations",
      description: "Understand hall policies and guidelines for smooth campus living.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Seat Allocation",
      description: "Learn about the seat allocation process and priority criteria.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Facility Booking",
      description: "Book common facilities and rooms for your events and activities.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Hall Administration",
      description: "Contact hall authorities and administrative staff easily.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security & Support",
      description: "24/7 security services and emergency support for all residents.",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What You Can Do
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive hall management services at your fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 group"
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              
              {/* Hover effect line */}
              <div className={`mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} transition-all duration-300 rounded-full`}></div>
            </div>
          ))}
        </div>

        {/* Additional Info Card */}
        <div className="mt-12 bg-gradient-to-r from-[#00df9a] to-green-500 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-black mr-3" />
            <h3 className="text-2xl font-bold text-black">
              Your Home Away From Home
            </h3>
          </div>
          <p className="text-gray-900 text-lg mb-4 max-w-2xl mx-auto">
            Experience comfortable and secure campus living with all essential services integrated into one platform
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-800">
            <div className="bg-black/20 px-3 py-1 rounded-full">Secure</div>
            <div className="bg-black/20 px-3 py-1 rounded-full">Easy to Use</div>
            <div className="bg-black/20 px-3 py-1 rounded-full">24/7 Access</div>
            <div className="bg-black/20 px-3 py-1 rounded-full">Real-time Updates</div>
            <div className="bg-black/20 px-3 py-1 rounded-full">Mobile Friendly</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;