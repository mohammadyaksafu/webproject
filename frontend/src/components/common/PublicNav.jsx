import React from "react";
import { Link } from "react-router-dom";

const PublicNav = ({ isActiveRoute }) => {
  return (
    <>
      <Link 
        to="/" 
        className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
          isActiveRoute('/') 
            ? 'bg-[#00df9a] text-black' 
            : 'hover:text-[#00df9a]'
        }`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
          isActiveRoute('/about') 
            ? 'bg-[#00df9a] text-black' 
            : 'hover:text-[#00df9a]'
        }`}
      >
        About
      </Link>
      <Link 
        to="/contact" 
        className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
          isActiveRoute('/contact') 
            ? 'bg-[#00df9a] text-black' 
            : 'hover:text-[#00df9a]'
        }`}
      >
        Hall Administration
      </Link>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3 ml-4">
        <Link 
          to="/login" 
          className="bg-[#00df9a] text-black px-4 py-2 rounded-md font-semibold hover:bg-white transition-colors duration-200 text-sm"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="border border-[#00df9a] px-4 py-2 rounded-md font-semibold hover:bg-[#00df9a] hover:text-black transition-colors duration-200 text-sm"
        >
          Register
        </Link>
      </div>
    </>
  );
};

export default PublicNav;