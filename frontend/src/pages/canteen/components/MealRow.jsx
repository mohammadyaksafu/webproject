import React from 'react';

const MealRow = ({ meal, onEdit, onDelete, onToggleAvailability }) => {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
      <td className="py-4 px-4">
        <div>
          <div className="font-semibold text-white">{meal.mealName}</div>
          {meal.description && (
            <div className="text-gray-400 text-sm mt-1">{meal.description}</div>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-white">{meal.mealType}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-[#00df9a] font-bold">${meal.price}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-white">{meal.quantity}</span>
      </td>
      <td className="py-4 px-4">
        <StatusBadge isAvailable={meal.isAvailable} />
      </td>
      <td className="py-4 px-4">
        <span className="text-gray-400">
          {new Date(meal.mealDate).toLocaleDateString()}
        </span>
      </td>
      <td className="py-4 px-4">
        <ActionButtons
          meal={meal}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailability={onToggleAvailability}
        />
      </td>
    </tr>
  );
};

const StatusBadge = ({ isAvailable }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
    isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`}>
    {isAvailable ? 'Available' : 'Disabled'}
  </span>
);

const ActionButtons = ({ meal, onEdit, onDelete, onToggleAvailability }) => (
  <div className="flex gap-2">
    <button
      onClick={() => onEdit(meal)}
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
    >
      Edit
    </button>
    <button
      onClick={() => onToggleAvailability(meal)}
      className={`px-3 py-1 rounded text-sm transition-colors ${
        meal.isAvailable
          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {meal.isAvailable ? 'Disable' : 'Enable'}
    </button>
    <button
      onClick={() => onDelete(meal.id)}
      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
    >
      Delete
    </button>
  </div>
);

export default MealRow;