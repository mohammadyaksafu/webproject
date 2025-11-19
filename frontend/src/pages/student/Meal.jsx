import React, { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Package,
  Loader2,
  Eye,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";

export default function Meal() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [selectedHall, setSelectedHall] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [halls, setHalls] = useState([]);
  const [expandedMeal, setExpandedMeal] = useState(null);

  // Fetch meals and halls data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get user info from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const hallId = user.hallId;

        // Fetch halls
        const hallsResponse = await fetch("http://localhost:8080/api/halls");
        if (hallsResponse.ok) {
          const hallsData = await hallsResponse.json();
          setHalls(hallsData);
        }

        // Fetch meals
        let mealsUrl = "http://localhost:8080/api/meals";
        if (hallId) {
          mealsUrl = `http://localhost:8080/api/meals/hall/${hallId}`;
        }

        const mealsResponse = await fetch(mealsUrl.trim());
        if (!mealsResponse.ok) {
          throw new Error(`Failed to fetch meals: ${mealsResponse.status}`);
        }

        const mealsData = await mealsResponse.json();
        setMeals(mealsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter meals
  const filteredMeals = meals.filter((meal) => {
    const matchesSearch =
      meal.mealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMealType =
      selectedMealType === "All" || meal.mealType === selectedMealType;
    const matchesHall = selectedHall === "All" || meal.hallId == selectedHall;
    const matchesAvailability = meal.isAvailable;

    return matchesSearch && matchesMealType && matchesHall && matchesAvailability;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case "BREAKFAST":
        return "bg-yellow-100 text-yellow-800";
      case "LUNCH":
        return "bg-orange-100 text-orange-800";
      case "DINNER":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00df9a] mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading meal information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Eye className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Meals</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00df9a] text-black px-6 py-2 rounded-lg font-semibold hover:bg-green-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-[#00df9a] to-green-500 p-3 rounded-full">
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#00df9a]">
              Meal Management
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            Browse available meals, check nutritional info, and manage your meal preferences
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#00df9a] focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-[#00df9a] transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-[#00df9a] focus:outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                  </select>
                </div>

                {halls.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hall
                    </label>
                    <select
                      value={selectedHall}
                      onChange={(e) => setSelectedHall(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-[#00df9a] focus:outline-none"
                    >
                      <option value="All">All Halls</option>
                      {halls.map((hall) => (
                        <option key={hall.id} value={hall.id}>
                          {hall.hallName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center hover:border-[#00df9a] transition-colors">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">
              {filteredMeals.length}
            </div>
            <div className="text-gray-400 font-medium">Available Meals</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center hover:border-[#00df9a] transition-colors">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">
              {filteredMeals.length > 0
                ? (
                    filteredMeals.reduce((sum, meal) => sum + meal.price, 0) /
                    filteredMeals.length
                  ).toFixed(2)
                : "0"}
            </div>
            <div className="text-gray-400 font-medium">Avg Price</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center hover:border-[#00df9a] transition-colors">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">
              {filteredMeals.reduce((sum, meal) => sum + meal.quantity, 0)}
            </div>
            <div className="text-gray-400 font-medium">Total Available</div>
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-[#00df9a] transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Meal Header */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {meal.mealName}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getMealTypeColor(
                        meal.mealType
                      )}`}
                    >
                      {meal.mealType}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#00df9a]">
                      ${meal.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Meal Content */}
                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {meal.description || "No description available"}
                  </p>

                  {/* Meal Info */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-700">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-[#00df9a]" />
                      <span>{formatDate(meal.mealDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Package className="h-4 w-4 mr-2 text-[#00df9a]" />
                      <span>{meal.quantity} available</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <UtensilsCrossed className="h-4 w-4 mr-2 text-[#00df9a]" />
                      <span>
                        {meal.hallName} ({meal.hallCode})
                      </span>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {expandedMeal === meal.id && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg text-gray-300 text-sm">
                      <p>
                        <strong>Hall ID:</strong> {meal.hallId}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {meal.isAvailable ? "Available" : "Unavailable"}
                      </p>
                      <p>
                        <strong>Created:</strong> {formatDate(meal.createdAt)}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setExpandedMeal(
                          expandedMeal === meal.id ? null : meal.id
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      {expandedMeal === meal.id ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Details
                        </>
                      )}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 bg-[#00df9a] hover:bg-green-500 text-black py-2 rounded-lg font-semibold transition-colors text-sm">
                      <Plus className="h-4 w-4" />
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-gray-700">
                <Search className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No meals found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}