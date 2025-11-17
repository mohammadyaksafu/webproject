import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const closeAllMenus = () => {
    setOpen(false);
  };

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl sm:text-2xl font-bold text-[#00df9a] whitespace-nowrap"
          onClick={closeAllMenus}
        >
          SUST Hall Management
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="hover:text-[#00df9a] transition-colors duration-200 font-medium">
            Home
          </Link>
          <Link to="/about" className="hover:text-[#00df9a] transition-colors duration-200 font-medium">
            About
          </Link>
          <Link to="/contact" className="hover:text-[#00df9a] transition-colors duration-200 font-medium">
            Hall Administration
          </Link>

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
        </nav>

        {/* Mobile toggle button */}
        <button 
          className="lg:hidden text-2xl p-2 hover:bg-gray-800 rounded-md transition-colors duration-200"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-black border-t border-gray-800 absolute top-full left-0 right-0 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link 
              to="/" 
              className="py-3 px-2 hover:text-[#00df9a] transition-colors duration-200 border-b border-gray-800"
              onClick={closeAllMenus}
            >
              Home
            </Link>
            
            <Link 
              to="/about" 
              className="py-3 px-2 hover:text-[#00df9a] transition-colors duration-200 border-b border-gray-800"
              onClick={closeAllMenus}
            >
              About
            </Link>

            <Link 
              to="/contact" 
              className="py-3 px-2 hover:text-[#00df9a] transition-colors duration-200 border-b border-gray-800"
              onClick={closeAllMenus}
            >
              Hall Administration
            </Link>

            <div className="flex flex-col gap-3 pt-2">
              <Link 
                to="/login" 
                className="bg-[#00df9a] text-black px-4 py-3 rounded-md font-semibold hover:bg-white transition-colors duration-200 text-center"
                onClick={closeAllMenus}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="border border-[#00df9a] px-4 py-3 rounded-md font-semibold hover:bg-[#00df9a] hover:text-black transition-colors duration-200 text-center"
                onClick={closeAllMenus}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;