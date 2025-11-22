import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentMeal() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodaysMeals = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      
      console.log("Saved User:", savedUser);

      
      if (!savedUser || !savedUser.hallName) {
        console.error("No saved user or hallName — user must login again.");
        setError("No hall assigned. Please contact administration.");
        setMeals([]);
        setLoading(false);
        return;
      }

      const hallName = savedUser.hallName;
      console.log("Using Hall Name:", hallName);

      // ✔ Correct API call with hall NAME (not code)
      const apiUrl = `http://localhost:8080/api/meals/hall/${encodeURIComponent(hallName)}/today`;
      console.log("API URL:", apiUrl);

      const res = await axios.get(apiUrl);

      console.log("Meal API Response:", res.data);

      // ✔ Set meals directly (assuming backend returns array)
      setMeals(res.data);

    } catch (err) {
      console.error("Meal Fetch Error:", err);
      setError("Unable to fetch meals. Please try again later.");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchTodaysMeals();
    }, 200);
  }, []);

  // Enhanced UI with better styling
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <p className="text-white text-lg">Loading today's meals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00df9a] text-black px-6 py-2 rounded-lg font-semibold hover:bg-green-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <p className="text-white text-lg">No meals available for today.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#00df9a] mb-8 text-center">
          Today's Meals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-[#00df9a] transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {meal.mealName || meal.itemName}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {meal.mealType}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {meal.description || "No description available"}
                </p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-2xl font-bold text-[#00df9a]">
                    ৳{meal.price}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Quantity: {meal.quantity}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Hall: {meal.hallName}
                  </p>
                </div>

                <button className="w-full bg-[#00df9a] text-black py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!meal.isAvailable || meal.quantity <= 0}>
                  {meal.quantity <= 0 ? "Out of Stock" : "Order Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}