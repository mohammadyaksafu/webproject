import React from "react";
import { Users, UserPlus, Building2 } from "lucide-react";

const AdminTabs = ({ activeTab, setActiveTab, pendingCount, allCount, hallsCount }) => {
  const tabs = [
    {
      id: "pending",
      name: "Pending Users",
      icon: Users,
      count: pendingCount,
      color: "yellow"
    },
    {
      id: "all",
      name: "All Users",
      icon: Users,
      count: allCount,
      color: "blue"
    },
    {
      id: "create",
      name: "Create User",
      icon: UserPlus,
      color: "green"
    },
    {
      id: "halls",
      name: "Hall Management",
      icon: Building2,
      count: hallsCount,
      color: "purple"
    }
  ];

  const getColorClasses = (color, isActive) => {
    const baseClasses = "flex items-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ";
    
    if (isActive) {
      const activeColors = {
        yellow: "bg-yellow-500 text-black",
        blue: "bg-blue-500 text-white",
        green: "bg-[#00df9a] text-black",
        purple: "bg-purple-500 text-white"
      };
      return baseClasses + activeColors[color];
    }
    
    const inactiveColors = {
      yellow: "bg-gray-800 text-yellow-400 hover:bg-yellow-500 hover:text-black",
      blue: "bg-gray-800 text-blue-400 hover:bg-blue-500 hover:text-white",
      green: "bg-gray-800 text-[#00df9a] hover:bg-[#00df9a] hover:text-black",
      purple: "bg-gray-800 text-purple-400 hover:bg-purple-500 hover:text-white"
    };
    return baseClasses + inactiveColors[color];
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={getColorClasses(tab.color, activeTab === tab.id)}
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.name}
          {tab.count !== undefined && (
            <span className="ml-2 bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default AdminTabs;