import React from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ isAuthenticated, user, isActiveRoute, handleLogout, closeAllMenus }) => {
  return (
    <div className="lg:hidden bg-black border-t border-gray-800 absolute top-full left-0 right-0 shadow-lg">
      <div className="px-4 py-4 flex flex-col gap-3">
        {isAuthenticated && user ? (
          <>
            {/* Authenticated Mobile Menu */}
            <div className="text-center text-gray-300 py-2 border-b border-gray-800">
              Welcome, {user.name}
              <span className="bg-[#00df9a] text-black px-2 py-1 rounded text-xs font-semibold ml-2">
                {user.role}
              </span>
            </div>

            <Link 
              to="/dashboard" 
              className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                isActiveRoute('/dashboard') 
                  ? 'bg-[#00df9a] text-black font-semibold' 
                  : 'hover:text-[#00df9a]'
              }`}
              onClick={closeAllMenus}
            >
              Dashboard
            </Link>

            {/* Admin Link - Only for ADMIN users */}
            {user.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                  isActiveRoute('/admin') 
                    ? 'bg-[#00df9a] text-black font-semibold' 
                    : 'hover:text-[#00df9a]'
                }`}
                onClick={closeAllMenus}
              >
                Admin
              </Link>
            )}

            <Link 
              to="/meal" 
              className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                isActiveRoute('/meal') 
                  ? 'bg-[#00df9a] text-black font-semibold' 
                  : 'hover:text-[#00df9a]'
              }`}
              onClick={closeAllMenus}
            >
              Meal
            </Link>

            <Link 
              to="/complaint" 
              className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                isActiveRoute('/complaint') 
                  ? 'bg-[#00df9a] text-black font-semibold' 
                  : 'hover:text-[#00df9a]'
              }`}
              onClick={closeAllMenus}
            >
              Complaint
            </Link>

            <Link 
              to="/notification" 
              className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                isActiveRoute('/notification') 
                  ? 'bg-[#00df9a] text-black font-semibold' 
                  : 'hover:text-[#00df9a]'
              }`}
              onClick={closeAllMenus}
            >
              Notification
            </Link>

            <button 
              onClick={handleLogout}
              className="border border-red-500 text-red-500 px-4 py-3 rounded-md font-semibold hover:bg-red-500 hover:text-white transition-colors duration-200 text-center mt-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Public Mobile Menu */}
            <Link 
              to="/" 
              className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                isActiveRoute('/') 
                  ? 'bg-[#00df9a] text-black font-semibold' 
                  : 'hover:text-[#00df9a]'
              }`}
              onClick={closeAllMenus}
            >
              Home
            </Link>
            
            <Link 
              to="/about" 
              className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                isActiveRoute('/about') 
                  ? 'bg-[#00df9a] text-black font-semibold' 
                  : 'hover:text-[#00df9a]'
              }`}
              onClick={closeAllMenus}
            >
              About
            </Link>

            <Link 
              to="/contact" 
              className={`py-3 px-2 rounded-md transition-colors duration-200 border-b border-gray-800 ${
                isActiveRoute('/contact') 
                  ? 'bg-[#00df9a] text-black font-semibold' 
                  : 'hover:text-[#00df9a]'
              }`}
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
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;