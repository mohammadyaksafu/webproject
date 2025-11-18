import React from "react";
import { Link } from "react-router-dom";

const AuthenticatedNav = ({ user, isActiveRoute, handleLogout }) => {
  return (
    <>
      {/* Dashboard Link */}
      <Link 
        to="/dashboard" 
        className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
          isActiveRoute('/dashboard') 
            ? 'bg-[#00df9a] text-black' 
            : 'hover:text-[#00df9a]'
        }`}
      >
        Dashboard
      </Link>

      {/* Admin Link - Only for ADMIN users */}
      {user.role === 'ADMIN' && (
        <Link 
          to="/admin" 
          className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
            isActiveRoute('/admin') 
              ? 'bg-[#00df9a] text-black' 
              : 'hover:text-[#00df9a]'
          }`}
        >
          Admin
        </Link>
      )}

      {/* Meal Link */}
      <Link 
        to="/meal" 
        className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
          isActiveRoute('/meal') 
            ? 'bg-[#00df9a] text-black' 
            : 'hover:text-[#00df9a]'
        }`}
      >
        Meal
      </Link>

      {/* Complaint Link */}
      <Link 
        to="/complaint" 
        className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
          isActiveRoute('/complaint') 
            ? 'bg-[#00df9a] text-black' 
            : 'hover:text-[#00df9a]'
        }`}
      >
        Complaint
      </Link>

      {/* Notification Link */}
      <Link 
        to="/notification" 
        className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
          isActiveRoute('/notification') 
            ? 'bg-[#00df9a] text-black' 
            : 'hover:text-[#00df9a]'
        }`}
      >
        Notification
      </Link>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">Welcome, {user.name}</span>
          <span className="bg-[#00df9a] text-black px-2 py-1 rounded text-xs font-semibold">
            {user.role}
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="border border-red-500 text-red-500 px-3 py-1 rounded-md font-semibold hover:bg-red-500 hover:text-white transition-colors duration-200 text-sm"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default AuthenticatedNav;