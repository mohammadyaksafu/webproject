import React, { useState, useEffect } from "react";
import axios from "axios";

const CanteenManagerDashboard = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });

  const [formData, setFormData] = useState({
    mealName: "",
    description: "",
    mealType: "BREAKFAST",
    price: "",
    quantity: "",
    mealDate: new Date().toISOString().split('T')[0],
    isAvailable: true
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAllMeals();
  }, []);

  const fetchAllMeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/meals");
      const mealsData = response.data;
      setMeals(mealsData);
      calculateStats(mealsData);
    } catch (err) {
      console.error("Error fetching meals:", err);
      alert("Failed to load meals.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (mealsData) => {
    const stats = {
      total: mealsData.length,
      available: mealsData.filter(m => m.isAvailable).length,
      breakfast: mealsData.filter(m => m.mealType === "BREAKFAST").length,
      lunch: mealsData.filter(m => m.mealType === "LUNCH").length,
      dinner: mealsData.filter(m => m.mealType === "DINNER").length
    };
    setStats(stats);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.mealName.trim()) {
      errors.mealName = "Meal name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Valid price is required";
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      errors.quantity = "Valid quantity is required";
    }

    if (!formData.mealDate) {
      errors.mealDate = "Meal date is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Prepare meal data according to your DTO structure
      const mealData = {
        mealName: formData.mealName.trim(),
        description: formData.description.trim(),
        mealType: formData.mealType,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        mealDate: new Date(formData.mealDate + 'T12:00:00').toISOString(),
        isAvailable: formData.isAvailable,
        hallId: user.hallId || 1 // Fallback to 1 if hallId not available
      };

      console.log("Sending meal data:", mealData);

      let response;
      if (editingMeal) {
        response = await axios.put(`http://localhost:8080/api/meals/${editingMeal.id}`, mealData);
        alert("Meal updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/meals", mealData);
        alert("Meal created successfully!");
      }

      setShowModal(false);
      setEditingMeal(null);
      resetForm();
      fetchAllMeals();
    } catch (err) {
      console.error("Error saving meal:", err);
      
      // More detailed error message
      if (err.response) {
        // Server responded with error status
        console.error("Server response:", err.response.data);
        alert(`Failed to save meal: ${err.response.data.message || 'Please check the data and try again.'}`);
      } else if (err.request) {
        // Request was made but no response received
        alert("Network error. Please check if the server is running.");
      } else {
        // Something else happened
        alert("An unexpected error occurred.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      mealName: "",
      description: "",
      mealType: "BREAKFAST",
      price: "",
      quantity: "",
      mealDate: new Date().toISOString().split('T')[0],
      isAvailable: true
    });
    setFormErrors({});
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      mealName: meal.mealName,
      description: meal.description || "",
      mealType: meal.mealType,
      price: meal.price.toString(),
      quantity: meal.quantity.toString(),
      mealDate: new Date(meal.mealDate).toISOString().split('T')[0],
      isAvailable: meal.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await axios.delete(`http://localhost:8080/api/meals/${mealId}`);
        alert("Meal deleted successfully!");
        fetchAllMeals();
      } catch (err) {
        console.error("Error deleting meal:", err);
        alert("Failed to delete meal.");
      }
    }
  };

  const handleToggleAvailability = async (meal) => {
    try {
      const updatedMeal = {
        ...meal,
        isAvailable: !meal.isAvailable
      };
      await axios.put(`http://localhost:8080/api/meals/${meal.id}`, updatedMeal);
      alert(`Meal ${!meal.isAvailable ? 'enabled' : 'disabled'} successfully!`);
      fetchAllMeals();
    } catch (err) {
      console.error("Error updating meal:", err);
      alert("Failed to update meal.");
    }
  };

  const filteredMeals = meals.filter(meal => {
    if (filter === "ALL") return true;
    return meal.mealType === filter;
  });

  const getMealTypeColor = (type) => {
    switch (type) {
      case "BREAKFAST": return "bg-orange-500";
      case "LUNCH": return "bg-green-500";
      case "DINNER": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getMealTypeIcon = (type) => {
    switch (type) {
      case "BREAKFAST": return "🥞";
      case "LUNCH": return "🍲";
      case "DINNER": return "🍽️";
      default: return "🍴";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00df9a] mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#00df9a]">Canteen Manager Dashboard</h1>
              <p className="text-gray-400 mt-2">Manage your hall's meal offerings</p>
            </div>
            <button
              onClick={() => {
                setEditingMeal(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Meal
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-400 text-sm">Total Meals</div>
            </div>
            <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg text-center border border-green-800">
              <div className="text-2xl font-bold text-green-400">{stats.available}</div>
              <div className="text-green-400 text-sm">Available</div>
            </div>
            <div className="bg-orange-900 bg-opacity-20 p-4 rounded-lg text-center border border-orange-800">
              <div className="text-2xl font-bold text-orange-400">{stats.breakfast}</div>
              <div className="text-orange-400 text-sm">Breakfast</div>
            </div>
            <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg text-center border border-green-800">
              <div className="text-2xl font-bold text-green-400">{stats.lunch}</div>
              <div className="text-green-400 text-sm">Lunch</div>
            </div>
            <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg text-center border border-blue-800">
              <div className="text-2xl font-bold text-blue-400">{stats.dinner}</div>
              <div className="text-blue-400 text-sm">Dinner</div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === "ALL" 
                  ? "bg-[#00df9a] text-black shadow-md" 
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              All Meals
            </button>
            {["BREAKFAST", "LUNCH", "DINNER"].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  filter === type 
                    ? "bg-[#00df9a] text-black shadow-md" 
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Table */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#00df9a]">Meal Management</h3>
            <button
              onClick={fetchAllMeals}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {filteredMeals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-white mb-2">No meals found</h3>
              <p className="text-gray-400 mb-6">Get started by adding your first meal</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200"
              >
                Add Meal
              </button>
            </div>
          ) : (
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
                  {filteredMeals.map((meal) => (
                    <tr key={meal.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
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
                          <span className="text-xl">{getMealTypeIcon(meal.mealType)}</span>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          meal.isAvailable 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {meal.isAvailable ? 'Available' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400">
                          {new Date(meal.mealDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(meal)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(meal)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              meal.isAvailable
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {meal.isAvailable ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDelete(meal.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Meal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingMeal(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Meal Name *</label>
                  <input
                    type="text"
                    name="mealName"
                    value={formData.mealName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                      formErrors.mealName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter meal name"
                  />
                  {formErrors.mealName && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.mealName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 resize-vertical bg-gray-800 text-white placeholder-gray-400"
                    placeholder="Enter meal description (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Meal Type *</label>
                    <select
                      name="mealType"
                      value={formData.mealType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white"
                    >
                      <option value="BREAKFAST">Breakfast</option>
                      <option value="LUNCH">Lunch</option>
                      <option value="DINNER">Dinner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Meal Date *</label>
                    <input
                      type="date"
                      name="mealDate"
                      value={formData.mealDate}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white ${
                        formErrors.mealDate ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {formErrors.mealDate && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.mealDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                        formErrors.price ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="0.00"
                    />
                    {formErrors.price && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                        formErrors.quantity ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="100"
                    />
                    {formErrors.quantity && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.quantity}</p>
                    )}
                  </div>
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
                    className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
                  >
                    {editingMeal ? 'Update Meal' : 'Create Meal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingMeal(null);
                      resetForm();
                    }}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanteenManagerDashboard;