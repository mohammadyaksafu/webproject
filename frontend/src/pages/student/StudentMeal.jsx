import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentMeal = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState("ALL");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    fetchTodaysMeals();
  }, []);

  const fetchTodaysMeals = async () => {
    try {
      setLoading(true);
      // Assuming user has hallId in their data
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`http://localhost:8080/api/meals/hall/${userData.hallId}/today`);
      setMeals(response.data);
    } catch (err) {
      console.error("Error fetching meals:", err);
      alert("Failed to load meals.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealsByDate = async (date) => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      // You might need to adjust this endpoint based on your date filtering implementation
      const response = await axios.get(`http://localhost:8080/api/meals/hall/${userData.hallId}`);
      const filteredMeals = response.data.filter(meal => 
        new Date(meal.mealDate).toISOString().split('T')[0] === date
      );
      setMeals(filteredMeals);
    } catch (err) {
      console.error("Error fetching meals:", err);
      alert("Failed to load meals.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchMealsByDate(date);
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

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00df9a] mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading meals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#00df9a]">Today's Meal Menu</h1>
              <p className="text-gray-400 mt-2">Check what's cooking in your hall canteen</p>
            </div>
            
            {/* Date Picker */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <label className="text-gray-400 text-sm mr-2">Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-transparent text-white border-none outline-none"
                />
              </div>
              <button
                onClick={fetchTodaysMeals}
                className="bg-[#00df9a] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200"
              >
                Today
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
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

        {/* Meals Grid */}
        {filteredMeals.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 rounded-xl shadow-sm border border-gray-800">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No meals available</h3>
            <p className="text-gray-400 mb-6">
              {filter === "ALL" 
                ? "There are no meals scheduled for this date." 
                : `No ${filter.toLowerCase()} meals available.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className={`bg-gray-900 rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                  meal.isAvailable 
                    ? "border-gray-700 hover:border-[#00df9a] hover:shadow-[#00df9a]/10" 
                    : "border-red-500 opacity-60"
                }`}
              >
                {/* Meal Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getMealTypeColor(meal.mealType)}`}>
                      <span className="text-2xl">{getMealTypeIcon(meal.mealType)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{meal.mealType.charAt(0) + meal.mealType.slice(1).toLowerCase()}</h3>
                      <p className="text-gray-400 text-sm">{formatTime(meal.mealDate)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#00df9a]">${meal.price}</p>
                    <p className={`text-xs font-semibold ${
                      meal.isAvailable ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {meal.isAvailable ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>

                {/* Meal Details */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">{meal.mealName}</h4>
                    {meal.description && (
                      <p className="text-gray-300 text-sm leading-relaxed">{meal.description}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Quantity: {meal.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{meal.hallName}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      meal.isAvailable
                        ? "bg-[#00df9a] text-black hover:bg-[#00c389] hover:shadow-lg"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!meal.isAvailable}
                  >
                    {meal.isAvailable ? "Order Now" : "Not Available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Available Meals</p>
                <p className="text-2xl font-bold text-white">
                  {meals.filter(m => m.isAvailable).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Meal Types</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(meals.map(m => m.mealType)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-white">{meals.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMeal;