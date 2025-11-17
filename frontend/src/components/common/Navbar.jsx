// components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-lg">H</span>
              </div>
              <span className="text-white font-bold text-xl">HallManager</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#"
              className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              About
            </a>
            <a
              href="#"
              className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Hall
            </a>
            <a
              href="#"
              className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Hall Administration
            </a>
            <a
              href="#"
              className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Login
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-blue-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </a>
          <a
            href="#"
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Hall
          </a>
          <a
            href="#"
            className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Hall Administration
          </a>
          <a
            href="#"
            className="bg-white text-blue-600 hover:bg-blue-100 block px-3 py-2 rounded-md text-base font-medium text-center"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;