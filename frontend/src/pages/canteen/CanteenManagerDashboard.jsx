// CanteenManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "./components/DashboardHeader";
import StatisticsCards from "./components/StatisticsCards";
import FilterSection from "./components/FilterSection";
import MealsTable from "./components/MealsTable";
import MealModal from "./components/MealModal";
import LoadingSpinner from "./components/LoadingSpinner";

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

  useEffect(() => {
    fetchAllMeals();
  }, []);

  const fetchAllMeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/meals");
      const mealsData = extractMealsData(response.data);
      setMeals(mealsData);
      calculateStats(mealsData);
    } catch (err) {
      console.error("Error fetching meals:", err);
      alert("Failed to load meals.");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const extractMealsData = (responseData) => {
    if (Array.isArray(responseData)) return responseData;
    
    const possibleArrays = ['data', 'meals', 'content', 'items'];
    for (const key of possibleArrays) {
      if (responseData && Array.isArray(responseData[key])) {
        return responseData[key];
      }
    }
    
    console.warn("Unexpected API response format:", responseData);
    return [];
  };

  const calculateStats = (mealsData) => {
    const mealsArray = Array.isArray(mealsData) ? mealsData : [];
    
    const newStats = {
      total: mealsArray.length,
      available: mealsArray.filter(m => m.isAvailable).length,
      breakfast: mealsArray.filter(m => m.mealType === "BREAKFAST").length,
      lunch: mealsArray.filter(m => m.mealType === "LUNCH").length,
      dinner: mealsArray.filter(m => m.mealType === "DINNER").length
    };
    setStats(newStats);
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
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

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMeal(null);
  };

  const filteredMeals = Array.isArray(meals) ? meals.filter(meal => {
    if (filter === "ALL") return true;
    return meal.mealType === filter;
  }) : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <DashboardHeader 
          onAddMeal={() => setShowModal(true)}
          onRefresh={fetchAllMeals}
        />
        
        <StatisticsCards stats={stats} />
        
        <FilterSection 
          filter={filter} 
          onFilterChange={setFilter} 
        />

        <MealsTable
          meals={filteredMeals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleAvailability={handleToggleAvailability}
          onRefresh={fetchAllMeals}
          onAddMeal={() => setShowModal(true)}
        />

        {showModal && (
          <MealModal
            editingMeal={editingMeal}
            onClose={handleModalClose}
            onSave={fetchAllMeals}
          />
        )}
      </div>
    </div>
  );
};

export default CanteenManagerDashboard;