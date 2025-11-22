// components/StatisticsCards.jsx
import React from 'react';

const StatisticsCards = ({ stats }) => {
  const statItems = [
    { key: 'total', label: 'Total Meals', color: 'gray' },
    { key: 'available', label: 'Available', color: 'green' },
    { key: 'breakfast', label: 'Breakfast', color: 'orange' },
    { key: 'lunch', label: 'Lunch', color: 'green' },
    { key: 'dinner', label: 'Dinner', color: 'blue' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map(({ key, label, color }) => (
        <StatCard
          key={key}
          value={stats[key]}
          label={label}
          color={color}
        />
      ))}
    </div>
  );
};

const StatCard = ({ value, label, color }) => {
  const colorClasses = {
    gray: 'bg-gray-800 border-gray-700 text-white',
    green: 'bg-green-900 bg-opacity-20 border-green-800 text-green-400',
    orange: 'bg-orange-900 bg-opacity-20 border-orange-800 text-orange-400',
    blue: 'bg-blue-900 bg-opacity-20 border-blue-800 text-blue-400'
  };

  return (
    <div className={`p-4 rounded-lg text-center border ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
};

export default StatisticsCards;