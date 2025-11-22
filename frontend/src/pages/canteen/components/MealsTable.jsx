// components/MealsTable.jsx
import React from 'react';
import MealRow from './MealRow';

const MealsTable = ({ meals, onEdit, onDelete, onToggleAvailability, onRefresh, onAddMeal }) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#00df9a]">Meal Management</h3>
        <button
          onClick={onRefresh}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
        >
          <RefreshIcon />
          Refresh
        </button>
      </div>

      {meals.length === 0 ? (
        <EmptyState onAddMeal={onAddMeal} />
      ) : (
        <TableContent 
          meals={meals} 
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailability={onToggleAvailability}
        />
      )}
    </div>
  );
};

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const EmptyState = ({ onAddMeal }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🍽️</div>
    <h3 className="text-xl font-semibold text-white mb-2">No meals found</h3>
    <p className="text-gray-400 mb-6">Get started by adding your first meal</p>
    <button
      onClick={onAddMeal}
      className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200"
    >
      Add Meal
    </button>
  </div>
);

const TableContent = ({ meals, onEdit, onDelete, onToggleAvailability }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Meal</th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Price</th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Quantity</th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {meals.map((meal) => (
          <MealRow
            key={meal.id}
            meal={meal}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailability={onToggleAvailability}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default MealsTable;