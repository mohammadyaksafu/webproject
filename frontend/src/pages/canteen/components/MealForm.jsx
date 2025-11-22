import React, { useState, useEffect } from 'react';

const MealForm = ({ formData, formErrors, loading, editingMeal, onChange, onSubmit, onCancel, halls = [] }) => {
  const [userHall, setUserHall] = useState(null);

  // Get user's hall from localStorage on component mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.hallName) {
      const userHallName = savedUser.hallName;
      
      // Find the hall details from available halls
      const hallDetails = halls.find(hall => 
        hall.hallName === userHallName || 
        hall.fullName === userHallName
      );
      
      setUserHall(hallDetails || { hallName: userHallName, fullName: userHallName });
      
      // Auto-set the hallName in formData if not already set
      if (!formData.hallName && userHallName) {
        onChange({
          target: {
            name: 'hallName',
            value: hallDetails?.hallName || userHallName
          }
        });
      }
    }
  }, [halls, formData.hallName, onChange]);

  const handleInputChange = (e) => {
    onChange(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Hall Information Display (Read-only) */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <label className="block text-sm font-semibold text-white mb-2">Hall *</label>
        {userHall ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">
                {userHall.fullName || userHall.hallName}
              </span>
              <span className="text-[#00df9a] text-sm bg-gray-700 px-2 py-1 rounded">
                {userHall.hallCode || 'N/A'}
              </span>
            </div>
            {userHall.type && (
              <p className="text-gray-400 text-sm">
                Type: <span className="text-white capitalize">{userHall.type.toLowerCase()}</span>
              </p>
            )}
            <input
              type="hidden"
              name="hallName"
              value={userHall.hallName || userHall.fullName}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <div className="text-yellow-400 text-sm">
            <p>Loading hall information...</p>
            <p className="text-xs text-gray-400 mt-1">
              Your hall will be automatically selected based on your account.
            </p>
          </div>
        )}
      </div>

      {/* Show error if no hall found */}
      {formErrors.hallName && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-3">
          <p className="text-red-200 text-sm">{formErrors.hallName}</p>
        </div>
      )}

      <FormField
        label="Meal Name *"
        name="mealName"
        type="text"
        value={formData.mealName}
        error={formErrors.mealName}
        onChange={handleInputChange}
        placeholder="Enter meal name"
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Enter meal description (optional)"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Meal Type *"
          name="mealType"
          type="select"
          value={formData.mealType}
          onChange={handleInputChange}
          options={[
            { value: "BREAKFAST", label: "Breakfast" },
            { value: "LUNCH", label: "Lunch" },
            { value: "DINNER", label: "Dinner" }
          ]}
        />

        <FormField
          label="Meal Date *"
          name="mealDate"
          type="date"
          value={formData.mealDate}
          error={formErrors.mealDate}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Price (৳) *"
          name="price"
          type="number"
          value={formData.price}
          error={formErrors.price}
          onChange={handleInputChange}
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <FormField
          label="Quantity *"
          name="quantity"
          type="number"
          value={formData.quantity}
          error={formErrors.quantity}
          onChange={handleInputChange}
          placeholder="100"
          min="1"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleInputChange}
          className="w-4 h-4 text-[#00df9a] bg-gray-800 border-gray-700 rounded focus:ring-[#00df9a] focus:ring-2"
        />
        <label className="text-white text-sm">Available for ordering</label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading || !userHall}
          className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (editingMeal ? 'Update Meal' : 'Create Meal')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
        >
          Cancel
        </button>
      </div>

      {!userHall && (
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3">
          <p className="text-yellow-200 text-sm">
            Unable to determine your hall. Please make sure you are logged in and assigned to a hall.
          </p>
        </div>
      )}
    </form>
  );
};

const FormField = ({ label, name, type, value, error, onChange, options, ...props }) => {
  const baseClasses = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400";
  const errorClasses = error ? 'border-red-500' : 'border-gray-700';

  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses} resize-vertical`}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses}`}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default MealForm;