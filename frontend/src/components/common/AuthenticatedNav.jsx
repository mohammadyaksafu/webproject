import getRoleBasedNav from "./RolebasedNav";

const AuthenticatedNav = ({ user, isActiveRoute, handleLogout }) => {
    const navItems = getRoleBasedNav();

    return (
      <>
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActiveRoute(item.path)
                ? "bg-[#00df9a] text-black font-semibold"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
            onClick={closeAllMenus}
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
        
        {/* User dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200">
            <span className="w-8 h-8 bg-[#00df9a] rounded-full flex items-center justify-center text-black font-semibold text-sm">
              {user.name?.charAt(0) || 'U'}
            </span>
            <span>{user.name}</span>
            <span>▼</span>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-300 border-b border-gray-700">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-[#00df9a]">{user.role}</p>
              </div>
              
              <a
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                onClick={closeAllMenus}
              >
                Profile
              </a>
              
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-200 text-left"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

export default AuthenticatedNav;