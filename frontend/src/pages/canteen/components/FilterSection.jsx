// components/FilterSection.jsx
import React from 'react';

const FilterSection = ({ filter, onFilterChange }) => {
  const filterTypes = ["ALL", "BREAKFAST", "LUNCH", "DINNER"];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filterTypes.map(type => (
        <FilterButton
          key={type}
          type={type}
          isActive={filter === type}
          onClick={() => onFilterChange(type)}
        />
      ))}
    </div>
  );
};

const FilterButton = ({ type, isActive, onClick }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all duration-200";
  const activeClasses = "bg-[#00df9a] text-black shadow-md";
  const inactiveClasses = "bg-gray-800 text-white hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {type === "ALL" ? "All Meals" : type.charAt(0) + type.slice(1).toLowerCase()}
    </button>
  );
};

export default FilterSection;