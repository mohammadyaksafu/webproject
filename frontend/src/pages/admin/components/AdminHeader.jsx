import React from "react";

const AdminHeader = ({ navigate }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#00df9a]">Admin Dashboard</h1>
        <p className="text-gray-400">Manage user accounts and roles</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-white bg-red-500 px-3 py-1 rounded-full text-sm font-semibold">
          ADMIN
        </span>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-[#00df9a] text-black px-4 py-2 rounded-md font-semibold hover:bg-white transition-colors"
        >
          User Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;