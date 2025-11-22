import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if (userData && userData.id) {
      fetchUserComplaints(userData.id);
    }
  }, []);

  const fetchUserComplaints = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/complaints/user/${userId}`);
      const userComplaints = response.data;
      setComplaints(userComplaints);
      calculateStats(userComplaints);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (complaintsData) => {
    const stats = {
      total: complaintsData.length,
      pending: complaintsData.filter(c => c.status === "OPEN").length,
      inProgress: complaintsData.filter(c => c.status === "IN_PROGRESS").length,
      resolved: complaintsData.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length
    };
    setStats(stats);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "bg-yellow-500 text-white";
      case "IN_PROGRESS": return "bg-blue-500 text-white";
      case "RESOLVED": return "bg-green-500 text-white";
      case "REJECTED": return "bg-red-500 text-white";
      case "CLOSED": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "bg-red-500 text-white";
      case "MEDIUM": return "bg-yellow-500 text-white";
      case "LOW": return "bg-green-500 text-white";
      case "URGENT": return "bg-red-700 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#00df9a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Complaints</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-[#00df9a] bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-[#00df9a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-[#00df9a] mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <div 
                  onClick={() => handleNavigation("/submit-complaint")}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-300 border border-gray-700 hover:border-[#00df9a] hover:shadow-lg hover:shadow-[#00df9a]/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00df9a] rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Submit Complaint</h4>
                      <p className="text-gray-400 text-sm">Report a new issue</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handleNavigation("/complaints")}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-300 border border-gray-700 hover:border-[#00df9a] hover:shadow-lg hover:shadow-[#00df9a]/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00df9a] rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">My Complaints</h4>
                      <p className="text-gray-400 text-sm">View all complaints</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handleNavigation("/meal")}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-300 border border-gray-700 hover:border-[#00df9a] hover:shadow-lg hover:shadow-[#00df9a]/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00df9a] rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Meal Menu</h4>
                      <p className="text-gray-400 text-sm">Today's schedule</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handleNavigation("/profile")}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-300 border border-gray-700 hover:border-[#00df9a] hover:shadow-lg hover:shadow-[#00df9a]/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00df9a] rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">My Profile</h4>
                      <p className="text-gray-400 text-sm">Account settings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#00df9a]">Recent Complaints</h3>
                <button 
                  onClick={() => handleNavigation("/complaints")}
                  className="text-[#00df9a] hover:text-[#00c389] text-sm font-semibold transition-colors duration-200"
                >
                  View All →
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00df9a] mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading complaints...</p>
                </div>
              ) : recentComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-400">No complaints yet</p>
                  <p className="text-gray-500 text-sm mt-1">Submit your first complaint to get started</p>
                  <button
                    onClick={() => handleNavigation("/submit-complaint")}
                    className="mt-4 bg-[#00df9a] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00c389] transition-colors duration-200"
                  >
                    Submit Complaint
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white text-lg">{complaint.title}</h4>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Category: {complaint.category}</span>
                        <span>Created: {formatDate(complaint.createdAt)}</span>
                      </div>
                      {complaint.adminResponse && (
                        <div className="mt-3 p-2 bg-green-900 bg-opacity-20 border border-green-800 rounded">
                          <p className="text-green-300 text-xs">
                            <strong>Response:</strong> {complaint.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;