 const getRoleBasedNav = () => {
    const baseNav = [
      { path: "/dashboard", label: "Dashboard", icon: "📊" }
    ];

    switch (user?.role) {
      case 'STUDENT':
        return [
          ...baseNav,
          { path: "/complaints", label: "My Complaints", icon: "📝" },
          { path: "/submit-complaint", label: "Submit Complaint", icon: "➕" },
          { path: "/hall-info", label: "Hall Info", icon: "🏠" },
          { path: "/meal-menu", label: "Meal Menu", icon: "🍽️" },
          { path: "/profile", label: "Profile", icon: "👤" }
        ];
      
      case 'STAFF':
        return [
          ...baseNav,
          { path: "/complaints", label: "Complaint Management", icon: "📋" },
          { path: "/student-management", label: "Students", icon: "👨‍🎓" },
          { path: "/room-allocation", label: "Room Allocation", icon: "🏨" },
          { path: "/reports", label: "Reports", icon: "📊" },
          { path: "/profile", label: "Profile", icon: "👤" }
        ];
      
      case 'ADMIN':
        return [
          ...baseNav,
          { path: "/user-management", label: "User Management", icon: "👥" },
          { path: "/hall-management", label: "Halls", icon: "🏢" },
          { path: "/complaints", label: "All Complaints", icon: "📑" },
          { path: "/system-settings", label: "Settings", icon: "⚙️" },
          { path: "/analytics", label: "Analytics", icon: "📈" },
          { path: "/profile", label: "Profile", icon: "👤" }
        ];
      
      case 'CANTEEN_MANAGER':
        return [
          ...baseNav,
          { path: "/menu-management", label: "Menu Management", icon: "📋" },
          { path: "/inventory", label: "Inventory", icon: "📦" },
          { path: "/orders", label: "Orders", icon: "🛒" },
          { path: "/canteen-reports", label: "Reports", icon: "📊" },
          { path: "/profile", label: "Profile", icon: "👤" }
        ];
      
      case 'TEACHER':
        return [
          ...baseNav,
          { path: "/student-info", label: "Student Info", icon: "👨‍🎓" },
          { path: "/hall-notices", label: "Notices", icon: "📢" },
          { path: "/meal-plans", label: "Meal Plans", icon: "🍽️" },
          { path: "/complaints", label: "Complaints", icon: "📝" },
          { path: "/profile", label: "Profile", icon: "👤" }
        ];
      
      default:
        return baseNav;
    }
  };

  export default getRoleBasedNav;