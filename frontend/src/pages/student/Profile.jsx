import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    studentId: "",
    session: ""
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      department: userData.department || "",
      studentId: userData.studentId || "",
      session: userData.session || ""
    });
    setLoading(false);
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Update user in localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update user in backend (if you have an API endpoint)
      // await axios.put(`http://localhost:8080/api/users/${user.id}`, formData);
      
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      department: user.department || "",
      studentId: user.studentId || "",
      session: user.session || ""
    });
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00df9a] mx-auto"></div>
            <p className="text-gray-400 mt-4 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>No user data found.</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 mt-4"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#00df9a]">My Profile</h1>
              <p className="text-gray-400 mt-2">Manage your account information</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {!editing ? (
              <button
                onClick={handleEditToggle}
                className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-[#00df9a] transition-colors duration-300">
            <h4 className="text-white font-semibold text-lg mb-2">Hall</h4>
            <p className="text-[#00df9a] text-xl font-bold">{user.hallName || "Not Assigned"}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-[#00df9a] transition-colors duration-300">
            <h4 className="text-white font-semibold text-lg mb-2">Email</h4>
            <p className="text-gray-300 text-sm truncate">{user.email}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-[#00df9a] transition-colors duration-300">
            <h4 className="text-white font-semibold text-lg mb-2">Role</h4>
            <p className="text-[#00df9a] text-xl font-bold">{user.role}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-[#00df9a] transition-colors duration-300">
            <h4 className="text-white font-semibold text-lg mb-2">Status</h4>
            <p className="text-green-400 text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Active
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-bold text-[#00df9a] mb-6">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
                  />
                ) : (
                  <p className="text-white text-lg font-semibold">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
                  />
                ) : (
                  <p className="text-white text-lg">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-white text-lg">{user.phone || "Not provided"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-bold text-[#00df9a] mb-6">Academic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Department</label>
                {editing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
                    placeholder="Enter department"
                  />
                ) : (
                  <p className="text-white text-lg">{user.department || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Student ID</label>
                {editing ? (
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
                    placeholder="Enter student ID"
                  />
                ) : (
                  <p className="text-white text-lg">{user.studentId || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Session</label>
                {editing ? (
                  <input
                    type="text"
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
                    placeholder="e.g., 2020-21"
                  />
                ) : (
                  <p className="text-white text-lg">{user.session || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-xl font-bold text-[#00df9a] mb-6">Account Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/change-password")}
              className="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Password
            </button>
            
            <button
              onClick={() => navigate("/complaints")}
              className="bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              My Complaints
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-xl font-bold text-[#00df9a] mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Member Since</p>
              <p className="text-white font-semibold">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Last Login</p>
              <p className="text-white font-semibold">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Today"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Account Type</p>
              <p className="text-[#00df9a] font-semibold">{user.role} Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;