// components/DashboardHeader.jsx
import React from 'react';

const DashboardHeader = ({ onAddMeal, onRefresh }) => {
  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#00df9a]">
            Canteen Manager Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage your hall's meal offerings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
          >
            <RefreshIcon />
            Refresh
          </button>
          <button
            onClick={onAddMeal}
            className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <AddIcon />
            Add New Meal
          </button>
        </div>
      </div>
    </div>
  );
};

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default DashboardHeader;