import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* University Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#00df9a] rounded-lg flex items-center justify-center mr-3">
                <img src="https://www.sust.edu/public/img/sust_logo_big.png" alt="SUST Logo" className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">SUST Hall Management</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Streamlining hall operations and enhancing student campus experience
              at Shahjalal University of Science & Technology. Providing modern
              residential facilities and efficient management solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-[#00df9a] hover:text-black p-2 rounded-lg transition-all duration-300 transform hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-[#00df9a] hover:text-black p-2 rounded-lg transition-all duration-300 transform hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-[#00df9a] hover:text-black p-2 rounded-lg transition-all duration-300 transform hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-[#00df9a] hover:text-black p-2 rounded-lg transition-all duration-300 transform hover:scale-110">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#00df9a]">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#00df9a] transition-colors duration-300 flex items-center group">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#00df9a] transition-colors duration-300 flex items-center group">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  All Halls
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-[#00df9a] transition-colors duration-300 flex items-center group">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-[#00df9a] transition-colors duration-300 flex items-center group">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  New Registration
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#00df9a] transition-colors duration-300 flex items-center group">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#00df9a]">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#00df9a] mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Shahjalal University of Science & Technology<br />
                  Kumargaon, Sylhet-3114<br />
                  Bangladesh
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#00df9a] mr-3 flex-shrink-0" />
                <a href="tel:+880821713491" className="text-gray-300 hover:text-[#00df9a] transition-colors">
                  +880 821-713491
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#00df9a] mr-3 flex-shrink-0" />
                <a href="mailto:info@sust.edu" className="text-gray-300 hover:text-[#00df9a] transition-colors">
                  info@sust.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex flex-col items-center space-y-4">
      <p className="text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} SUST Hall Management System. All rights reserved.
      </p>
      <div className="flex space-x-6">
        <a href="#" className="text-gray-400 hover:text-[#00df9a] text-sm transition-colors duration-300">
          Privacy Policy
        </a>
        <a href="#" className="text-gray-400 hover:text-[#00df9a] text-sm transition-colors duration-300">
          Terms of Service
        </a>
        <a href="#" className="text-gray-400 hover:text-[#00df9a] text-sm transition-colors duration-300">
          Sitemap
        </a>
      </div>
    </div>
  </div>
</div>
    </footer>
  );
};

export default Footer;