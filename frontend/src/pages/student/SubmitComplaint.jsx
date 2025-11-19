import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    hallName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const categories = [
    "Electrical",
    "Plumbing",
    "Furniture",
    "Cleanliness",
    "Internet",
    "Security",
    "Maintenance",
    "Other"
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);
    setFormData(prev => ({
      ...prev,
      hallName: userData.hallName || ""
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const complaintData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        hallName: formData.hallName,
        userId: user.id
      };

      const response = await axios.post("http://localhost:8080/api/complaints", complaintData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setSuccess("Complaint submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "MEDIUM",
        hallName: user.hallName || ""
      });

      // Redirect to complaints list after 2 seconds
      setTimeout(() => {
        navigate("/complaints");
      }, 2000);

    } catch (err) {
      console.error("Error submitting complaint:", err);
      setError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/complaints");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/complaints")}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#00df9a]">Submit New Complaint</h1>
              <p className="text-gray-400 mt-2">Fill out the form below to report an issue</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-900 bg-opacity-20 border border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-400 font-medium">{success}</p>
            </div>
            <p className="text-green-300 text-sm mt-1">Redirecting to complaints list...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Complaint Form */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Complaint Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                required
                disabled={loading}
              />
              <p className="text-gray-400 text-sm mt-1">Keep it concise and descriptive</p>
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Field */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                <option value="LOW">Low - Minor inconvenience</option>
                <option value="MEDIUM">Medium - Needs attention</option>
                <option value="HIGH">High - Urgent issue</option>
                <option value="URGENT">Urgent - Critical problem</option>
              </select>
            </div>

            {/* Hall Name Field */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Hall Name
              </label>
              <input
                type="text"
                name="hallName"
                value={formData.hallName}
                onChange={handleChange}
                placeholder="Your hall name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                disabled={loading}
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Detailed Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Please provide detailed information about the issue, including location, specific problems, and any other relevant details..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 resize-vertical placeholder-gray-400"
                required
                disabled={loading}
              />
              <p className="text-gray-400 text-sm mt-1">
                The more details you provide, the better we can assist you
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#00df9a] text-black px-6 py-4 rounded-lg font-bold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting Complaint...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Complaint
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-[#00df9a] mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p className="font-semibold text-white mb-2">Emergency Issues</p>
              <p>For urgent matters like electrical hazards, water leaks, or security concerns, please call:</p>
              <p className="text-[#00df9a] font-semibold mt-1">Campus Security: 123-456-7890</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Response Time</p>
              <p>We typically respond to complaints within 24-48 hours. Urgent issues are prioritized.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}