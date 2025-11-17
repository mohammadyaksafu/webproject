import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, CalendarDays, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background overlay effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 md:px-12 lg:px-20 max-w-3xl">
        <div className="flex justify-center mb-6">
          <Building2 className="h-14 w-14 text-yellow-300 drop-shadow-md" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
          Smart Hall Management System
        </h1>

        <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
          Simplify your event and accommodation booking process with our 
          intelligent management platform — built for universities, hotels, and 
          community halls.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-6 py-3 rounded-full transition-all"
          >
            <CalendarDays className="mr-2 h-5 w-5" /> Book a Hall
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-indigo-700 font-semibold px-6 py-3 rounded-full transition-all"
          >
            <Users className="mr-2 h-5 w-5" /> Manage Members
          </Button>
        </div>
      </div>

      {/* Decorative gradient circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
