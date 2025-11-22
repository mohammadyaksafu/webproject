import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentMeal() {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, BREAKFAST, LUNCH, DINNER

  const fetchTodaysMeals = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      
      console.log("Saved User:", savedUser);

      if (!savedUser || !savedUser.hallName) {
        console.error("No saved user or hallName — user must login again.");
        setError("No hall assigned. Please contact administration.");
        setMeals([]);
        setFilteredMeals([]);
        setLoading(false);
        return;
      }

      // Map full hall names to short names used in the database
      const hallNameMapping = {
        "Shah Paran Hall": "SHPH",
        "Syed Mujtaba Ali Hall": "SMAH", 
        "Bijoy 24 Hall": "B24H",
        "Ayesha Siddiqa Hall": "ASH",
        "Begum Sirajunnesa Chowdhury Hall": "BSCH",
        "Fatimah Tuz Zahra Hall": "FTZH"
      };

      let hallName = savedUser.hallName;
      

      if (hallNameMapping[hallName]) {
        console.log(`Mapping "${hallName}" to "${hallNameMapping[hallName]}"`);
        hallName = hallNameMapping[hallName];
      }

      console.log("Using Hall Name:", hallName);

      const apiUrl = `http://localhost:8080/api/meals/hall/${encodeURIComponent(hallName)}/today`;
      console.log("API URL:", apiUrl);

      const res = await axios.get(apiUrl);

      console.log("Full API Response:", res.data);

     
      let mealsData = [];
      if (res.data.success && res.data.data && Array.isArray(res.data.data)) {
        mealsData = res.data.data;
        console.log("Meals data extracted:", mealsData);
      } else if (Array.isArray(res.data)) {
        
        mealsData = res.data;
        console.log("Meals data (direct array):", mealsData);
      } else {
        console.warn("Unexpected response structure:", res.data);
        setError("No meals available for today.");
      }

      setMeals(mealsData);
      setFilteredMeals(mealsData); 

    } catch (err) {
      console.error("Meal Fetch Error:", err);
      
     
      if (err.response) {
       
        console.error("Response error:", err.response.status, err.response.data);
        if (err.response.status === 404) {
          if (err.response.data.message?.includes("Hall not found")) {
            setError("Your hall is not properly configured. Please contact administration.");
          } else {
            setError("No meals available for your hall today.");
          }
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(`Error: ${err.response.data.message || 'Unable to fetch meals'}`);
        }
      } else if (err.request) {
        // Request made but no response received
        console.error("No response received:", err.request);
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        // Other errors
        console.error("Request setup error:", err.message);
        setError("Failed to make request: " + err.message);
      }
      
      setMeals([]);
      setFilteredMeals([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter meals based on active filter
  useEffect(() => {
    if (activeFilter === "ALL") {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter(meal => 
        meal.mealType?.toUpperCase() === activeFilter
      );
      setFilteredMeals(filtered);
    }
  }, [activeFilter, meals]);

  const handleFilter = (filterType) => {
    setActiveFilter(filterType);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setActiveFilter("ALL");
    fetchTodaysMeals();
  };

  const handleOrder = (meal) => {
    // Placeholder for order functionality
    console.log("Ordering meal:", meal);
    alert(`Order placed for ${meal.mealName}! This is a demo - real ordering would connect to a payment system.`);
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType?.toUpperCase()) {
      case 'BREAKFAST':
        return 'bg-yellow-100 text-yellow-800';
      case 'LUNCH':
        return 'bg-orange-100 text-orange-800';
      case 'DINNER':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getFilterButtonColor = (filterType) => {
    const isActive = activeFilter === filterType;
    switch (filterType) {
      case 'ALL':
        return isActive 
          ? 'bg-[#00df9a] text-black border-[#00df9a]' 
          : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600';
      case 'BREAKFAST':
        return isActive 
          ? 'bg-yellow-500 text-white border-yellow-500' 
          : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600';
      case 'LUNCH':
        return isActive 
          ? 'bg-orange-500 text-white border-orange-500' 
          : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600';
      case 'DINNER':
        return isActive 
          ? 'bg-purple-500 text-white border-purple-500' 
          : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600';
      default:
        return 'bg-gray-700 text-white border-gray-600';
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity > 10) return { text: 'In Stock', color: 'text-green-400' };
    if (quantity > 0) return { text: 'Low Stock', color: 'text-yellow-400' };
    return { text: 'Out of Stock', color: 'text-red-400' };
  };

  // Count meals by type for filter badges
  const mealCounts = {
    ALL: meals.length,
    BREAKFAST: meals.filter(meal => meal.mealType?.toUpperCase() === 'BREAKFAST').length,
    LUNCH: meals.filter(meal => meal.mealType?.toUpperCase() === 'LUNCH').length,
    DINNER: meals.filter(meal => meal.mealType?.toUpperCase() === 'DINNER').length,
  };

  useEffect(() => {
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      fetchTodaysMeals();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00df9a] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading today's meals...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching the latest menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-red-400 text-xl font-bold mb-2">Unable to Load Meals</h3>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <h3 className="text-white text-xl font-bold mb-2">No Meals Available</h3>
          <p className="text-gray-400 mb-6">There are no meals scheduled for today in your hall.</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors"
            >
              Refresh
            </button>
            <p className="text-gray-500 text-sm">
              Check back later or contact your hall administration for meal schedules.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {["ALL", "BREAKFAST", "LUNCH", "DINNER"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => handleFilter(filterType)}
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 flex items-center gap-2 ${getFilterButtonColor(filterType)}`}
              >
                <span>{filterType === 'ALL' ? 'All Meals' : filterType}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeFilter === filterType 
                    ? 'bg-black bg-opacity-20' 
                    : 'bg-gray-600'
                }`}>
                  {mealCounts[filterType]}
                </span>
              </button>
            ))}
          </div>

          {/* Active Filter Info */}
          <div className="text-center">
            <p className="text-gray-400">
              Showing <span className="text-[#00df9a] font-semibold">{filteredMeals.length}</span> of{" "}
              <span className="text-white font-semibold">{meals.length}</span> meals
              {activeFilter !== "ALL" && (
                <span className="text-gray-400"> for {activeFilter.toLowerCase()}</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => {
            const stockStatus = getStockStatus(meal.quantity);
            
            return (
              <div
                key={meal.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-[#00df9a] transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              >
                <div className="p-6">
                  {/* Meal Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 truncate">
                        {meal.mealName || "Unnamed Meal"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getMealTypeColor(meal.mealType)}`}>
                          {meal.mealType || 'MEAL'}
                        </span>
                        {!meal.isAvailable && (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-400 mb-4 min-h-[3rem] line-clamp-2">
                    {meal.description || "No description available"}
                  </p>
                  
                  {/* Price and Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#00df9a]">
                        ৳{meal.price || 0}
                      </span>
                      <span className={`text-sm font-semibold ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Quantity: {meal.quantity || 0}</span>
                      {meal.mealDate && (
                        <span>
                          {new Date(meal.mealDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Button */}
                  <button 
                    onClick={() => handleOrder(meal)}
                    className="w-full bg-[#00df9a] text-black py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-shadow"
                    disabled={!meal.isAvailable || meal.quantity <= 0}
                  >
                    {meal.quantity <= 0 
                      ? "Out of Stock" 
                      : !meal.isAvailable 
                      ? "Not Available"
                      : "Order Now"
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No results for filter */}
        {filteredMeals.length === 0 && activeFilter !== "ALL" && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-white text-xl font-bold mb-2">No {activeFilter.toLowerCase()} meals found</h3>
            <p className="text-gray-400 mb-6">
              There are no {activeFilter.toLowerCase()} meals available for today.
            </p>
            <button
              onClick={() => handleFilter("ALL")}
              className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors"
            >
              Show All Meals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}