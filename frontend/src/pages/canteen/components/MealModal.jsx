// components/MealModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import MealForm from './MealForm';

const MealModal = ({ editingMeal, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    mealName: editingMeal?.mealName || "",
    description: editingMeal?.description || "",
    mealType: editingMeal?.mealType || "BREAKFAST",
    price: editingMeal?.price?.toString() || "",
    quantity: editingMeal?.quantity?.toString() || "",
    mealDate: editingMeal ? new Date(editingMeal.mealDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isAvailable: editingMeal?.isAvailable ?? true
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      const mealData = {
        mealName: formData.mealName.trim(),
        description: formData.description.trim(),
        mealType: formData.mealType,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        mealDate: new Date(formData.mealDate + 'T12:00:00').toISOString(),
        isAvailable: formData.isAvailable,
        hallId: user.hallId || 1
      };

      if (editingMeal) {
        await axios.put(`http://localhost:8080/api/meals/${editingMeal.id}`, mealData);
        alert("Meal updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/meals", mealData);
        alert("Meal created successfully!");
      }

      onClose();
      onSave();
    } catch (err) {
      console.error("Error saving meal:", err);
      
      if (err.response) {   
        alert(`Failed to save meal: ${err.response.data.message || 'Please check the data and try again.'}`);
      } else if (err.request) {
        alert("Network error. Please check if the server is running.");
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            onSubmit={handleSubmit}
            onCancel={onClose}
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