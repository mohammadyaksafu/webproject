import React from "react";

const MobileMenu = ({ 
  isAuthenticated, 
  user, 
  isActiveRoute, 
  handleLogout, 
  closeAllMenus,
  navItems = [] 
}) => {
  return (
    <div className="lg:hidden bg-gray-900 border-t border-gray-800">
      <div className="px-4 py-4 space-y-2">
        {isAuthenticated && user ? (
          <>
            {/* Navigation Items */}
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.path)
                    ? "bg-[#00df9a] text-black font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={closeAllMenus}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </a>
            ))}
            
            {/* User Info */}
            <div className="px-4 py-3 border-t border-gray-700 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#00df9a] rounded-full flex items-center justify-center text-black font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-[#00df9a]">{user.role}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  <span>👤</span>
                  Profile
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  <span>⚙️</span>
                  Settings
                </a>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200 text-left"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          // Public navigation for non-authenticated users
          <>
            <a
              href="/login"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
              onClick={closeAllMenus}
            >
              🔑 Login
            </a>
            <a
              href="/register"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
              onClick={closeAllMenus}
            >
              📝 Register
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;