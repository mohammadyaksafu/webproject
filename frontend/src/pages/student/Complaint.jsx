import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM"
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      if (user && user.id) {
        // Fetch user-specific complaints
        const res = await axios.get(`http://localhost:8080/api/complaints/user/${user.id}`);
        setComplaints(res.data);
      } else {
        // Fetch all complaints (for admin or if no user)
        const res = await axios.get("http://localhost:8080/api/complaints");
        setComplaints(res.data);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load complaints.");
      setLoading(false);
    }
  };

  const handleAddComplaint = () => {
    navigate("/submit-complaint");
  };

  const handleEditClick = (complaint) => {
    setEditingId(complaint.id);
    setEditForm({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category || "",
      priority: complaint.priority || "MEDIUM"
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/complaints/${id}`, editForm);
      
      // Update the complaint in the local state
      setComplaints(prev => prev.map(c => 
        c.id === id ? response.data : c
      ));
      
      setEditingId(null);
      alert("Complaint updated successfully!");
    } catch (err) {
      console.error("Error updating complaint:", err);
      alert("Failed to update complaint.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      category: "",
      priority: "MEDIUM"
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/complaints/${id}`);
      
      // Remove the complaint from the local state
      setComplaints(prev => prev.filter(c => c.id !== id));
      alert("Complaint deleted successfully!");
    } catch (err) {
      console.error("Error deleting complaint:", err);
      alert("Failed to delete complaint.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
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

  if (loading) return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center py-5 text-gray-400">Loading complaints...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-red-400 bg-red-900 bg-opacity-20 p-4 rounded-lg border border-red-800">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#00df9a]">
                {user?.role === "ADMIN" ? "All Complaints" : "My Complaints"}
              </h1>
              <p className="text-gray-400 mt-2">
                {user?.role === "ADMIN" 
                  ? "Manage and respond to all complaints" 
                  : "Manage and track your complaints"
                }
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {user?.role !== "ADMIN" && (
                <button
                  onClick={handleAddComplaint}
                  className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Complaint
                </button>
              )}
              <button
                onClick={fetchComplaints}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => navigate("/admin-complaints")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin View
                </button>
              )}
            </div>
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 rounded-xl shadow-sm border border-gray-800">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {user?.role === "ADMIN" ? "No complaints found" : "No complaints yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {user?.role === "ADMIN" 
                ? "There are no complaints in the system." 
                : "Submit your first complaint to get started with our support system."
              }
            </p>
            {user?.role !== "ADMIN" && (
              <button
                onClick={handleAddComplaint}
                className="bg-[#00df9a] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Your First Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="p-6 border border-gray-800 rounded-xl shadow-sm bg-gray-900 hover:shadow-lg transition-all duration-300"
              >
                {editingId === complaint.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Enter complaint title"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows="4"
                      className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 resize-vertical bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Enter detailed description"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white"
                      >
                        <option value="">Select Category</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Cleanliness">Cleanliness</option>
                        <option value="Internet">Internet</option>
                        <option value="Security">Security</option>
                        <option value="Other">Other</option>
                      </select>
                      <select
                        name="priority"
                        value={editForm.priority}
                        onChange={handleEditChange}
                        className="p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white"
                      >
                        <option value="LOW">Low Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="HIGH">High Priority</option>
                        <option value="URGENT">Urgent Priority</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleUpdate(complaint.id)}
                        className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <h2 className="text-xl font-bold text-white">{complaint.title}</h2>
                      {user?.role !== "ADMIN" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(complaint)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(complaint.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 mt-2 mb-4 whitespace-pre-wrap leading-relaxed bg-gray-800 p-4 rounded-lg border border-gray-700">
                      {complaint.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} Priority
                      </span>
                      {complaint.category && (
                        <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {complaint.category}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="space-y-2">
                        <p><strong className="text-white">Submitted By:</strong> {complaint.userName || `User ID: ${complaint.userId}`}</p>
                        <p><strong className="text-white">Category:</strong> {complaint.category}</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong className="text-white">Created:</strong> {formatDate(complaint.createdAt)}</p>
                        <p><strong className="text-white">Updated:</strong> {formatDate(complaint.updatedAt)}</p>
                        {complaint.resolvedAt && (
                          <p><strong className="text-white">Resolved:</strong> {formatDate(complaint.resolvedAt)}</p>
                        )}
                      </div>
                    </div>

                    {/* Admin Response Section */}
                    {complaint.adminResponse && (
                      <div className="mt-4 p-4 bg-green-900 bg-opacity-20 border border-green-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-green-400 font-semibold text-sm uppercase tracking-wide">Official Response:</p>
                          {complaint.respondedBy && (
                            <span className="text-green-300 text-xs">By Admin ID: {complaint.respondedBy}</span>
                          )}
                        </div>
                        <p className="text-green-300 leading-relaxed">{complaint.adminResponse}</p>
                      </div>
                    )}

                    {/* Activity History - Notes */}
                    {complaint.notes && complaint.notes.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg">
                        <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-3">Activity History:</p>
                        <div className="space-y-3">
                          {complaint.notes.map((note, index) => (
                            <div key={index} className="flex gap-3 text-sm">
                              <div className="flex-shrink-0 w-2 bg-blue-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-blue-300">{note.note}</p>
                                <p className="text-blue-400 text-xs mt-1">
                                  {formatDate(note.createdAt)} 
                                  {note.authorName && ` • By ${note.authorName}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Quick Actions */}
                    {user && user.role === "ADMIN" && (
                      <div className="mt-6 border-t border-gray-700 pt-6">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold text-white">Quick Actions:</p>
                          <button
                            onClick={() => navigate("/admin-complaints")}
                            className="bg-[#00df9a] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00c389] transition-colors duration-200 flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Manage in Admin Panel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}