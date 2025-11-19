import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicNav from "./PublicNav";
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

  // Role-based navigation configuration
  const getRoleBasedNav = (user) => {
    const baseNav = [
      { path: "/dashboard", label: "Dashboard" }
    ];

    if (!user || !user.role) return baseNav;

    switch (user.role) {
      case 'STUDENT':
        return [
          ...baseNav,
          { path: "/complaints", label: "My Complaints" },
          { path: "/submit-complaint", label: "Submit Complaint" },
          { path: "/meal", label: "Meal Menu" },
          { path: "/profile", label: "Profile" }
        ];
      
      case 'STAFF':
        return [
          ...baseNav,
          { path: "/profile", label: "Profile" }
        ];
      
      case 'ADMIN':
        return [
          ...baseNav,
          { path: "/complaints", label: "All Complaints" },
          { path: "/profile", label: "Profile" }
        ];
      
      case 'CANTEEN_MANAGER':
        return [
          ...baseNav,
          { path: "/meal", label: "Menu Management" },
          { path: "/canteen-reports", label: "Reports" },
          { path: "/profile", label: "Profile" }
        ];
      
      case 'TEACHER':
        return [
          ...baseNav,
          { path: "/student-info", label: "Student Info" },
          { path: "/hall-notices", label: "Notices" },
          { path: "/meal-plans", label: "Meal Plans" },
          { path: "/complaints", label: "Complaints" },
          { path: "/profile", label: "Profile" }
        ];
      
      default:
        return baseNav;
    }
  };

  const AuthenticatedNav = ({ user, isActiveRoute, handleLogout }) => {
    const navItems = getRoleBasedNav(user);

    return (
      <>
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActiveRoute(item.path)
                ? "bg-[#00df9a] text-black font-semibold"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
            onClick={closeAllMenus}
          >
            {item.label}
          </a>
        ))}
        
        {/* User dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200">
            <span className="w-8 h-8 bg-[#00df9a] rounded-full flex items-center justify-center text-black font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
            <span>{user?.name || 'User'}</span>
            <span className="text-xs">▼</span>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-300 border-b border-gray-700">
                <p className="font-semibold">{user?.name || 'User'}</p>
                <p className="text-xs text-[#00df9a]">{user?.role || 'Unknown'}</p>
              </div>
              
              <a
                href="/profile"
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                onClick={closeAllMenus}
              >
                Profile
              </a>
              
              <a
                href="/settings"
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                onClick={closeAllMenus}
              >
                Settings
              </a>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </>
    );
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
        <nav className="hidden lg:flex items-center gap-4">
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
          navItems={isAuthenticated && user ? getRoleBasedNav(user) : []}
        />
      )}
    </header>
  );
};

export default Navbar;