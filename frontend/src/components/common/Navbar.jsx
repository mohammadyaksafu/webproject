import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicNav from "./PublicNav";
import AuthenticatedNav from "./AuthenticatedNav";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const user = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const closeAllMenus = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    closeAllMenus();
    navigate('/');
    window.location.reload();
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          className="text-xl sm:text-2xl font-bold text-[#00df9a] whitespace-nowrap"
          onClick={closeAllMenus}
        >
          SUST Hall Management
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {isAuthenticated && user ? (
            <AuthenticatedNav 
              user={user} 
              isActiveRoute={isActiveRoute}
              handleLogout={handleLogout}
            />
          ) : (
            <PublicNav isActiveRoute={isActiveRoute} />
          )}
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
        <MobileMenu 
          isAuthenticated={isAuthenticated}
          user={user}
          isActiveRoute={isActiveRoute}
          handleLogout={handleLogout}
          closeAllMenus={closeAllMenus}
        />
      )}
    </header>
  );
};

export default Navbar;