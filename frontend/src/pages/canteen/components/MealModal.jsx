import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MealForm from './MealForm';

const MealModal = ({ editingMeal, onClose, onSave }) => {
  const [halls, setHalls] = useState([]);
  const [formData, setFormData] = useState({
    mealName: editingMeal?.mealName || "",
    description: editingMeal?.description || "",
    mealType: editingMeal?.mealType || "BREAKFAST",
    price: editingMeal?.price?.toString() || "",
    quantity: editingMeal?.quantity?.toString() || "",
    mealDate: editingMeal ? new Date(editingMeal.mealDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isAvailable: editingMeal?.isAvailable ?? true,
    hallName: editingMeal?.hallName || ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingHalls, setFetchingHalls] = useState(true);

  // Fetch available halls when component mounts
  useEffect(() => {
    fetchHalls();
  }, []);

  // Auto-set hallName from localStorage when halls are loaded
  useEffect(() => {
    if (halls.length > 0 && !formData.hallName) {
      const user = JSON.parse(localStorage.getItem("user"));
      const userHallName = user?.hallName;
      
      if (userHallName) {
        // Find the exact hall match from available halls
        const userHall = halls.find(hall => 
          hall.hallName === userHallName || 
          hall.fullName === userHallName
        );
        
        if (userHall) {
          setFormData(prev => ({
            ...prev,
            hallName: userHall.hallName
          }));
        }
      }
    }
  }, [halls, formData.hallName]);

  const fetchHalls = async () => {
    try {
      setFetchingHalls(true);
      const response = await axios.get('http://localhost:8080/api/halls');
      if (response.data) {
        setHalls(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error fetching halls:', err);
    } finally {
      setFetchingHalls(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.mealName.trim()) {
      errors.mealName = "Meal name is required";
    }

    if (!formData.hallName) {
      errors.hallName = "Hall information is required";
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

  // Special handler for hallName changes from MealForm
  const handleHallNameChange = (hallName) => {
    setFormData(prev => ({
      ...prev,
      hallName
    }));

    if (formErrors.hallName) {
      setFormErrors(prev => ({
        ...prev,
        hallName: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare meal data with hallName from localStorage
      const mealData = {
        mealName: formData.mealName.trim(),
        description: formData.description.trim(),
        mealType: formData.mealType,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        mealDate: new Date(formData.mealDate + 'T12:00:00').toISOString(),
        isAvailable: formData.isAvailable,
        hallName: formData.hallName // This comes from localStorage via MealForm
      };

      console.log('Submitting meal data:', mealData);

      let response;
      if (editingMeal) {
        response = await axios.put(`http://localhost:8080/api/meals/${editingMeal.id}`, mealData);
        alert("Meal updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/meals", mealData);
        alert("Meal created successfully!");
      }

      console.log('Server response:', response.data);
      onClose();
      onSave();
    } catch (err) {
      console.error("Error saving meal:", err);
      
      if (err.response) {   
        const errorMessage = err.response.data.message || 
                            err.response.data.error || 
                            'Please check the data and try again.';
        alert(`Failed to save meal: ${errorMessage}`);
        
        // Log detailed error for debugging
        console.error('Error details:', err.response.data);
      } else if (err.request) {
        alert("Network error. Please check if the server is running.");
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingHalls) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00df9a] mx-auto mb-4"></div>
            <p className="text-white">Loading meal form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingMeal ? 'Edit Meal' : 'Add New Meal'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <CloseIcon />
            </button>
          </div>

          <MealForm
            formData={formData}
            formErrors={formErrors}
            loading={loading}
            editingMeal={editingMeal}
            onChange={handleInputChange}
            onHallNameChange={handleHallNameChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            halls={halls}
          />
        </div>
      </div>
    </div>
  );
};

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default MealModal;