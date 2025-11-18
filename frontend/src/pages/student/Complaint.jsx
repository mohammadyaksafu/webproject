import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "MEDIUM"
  });
  const [activeTab, setActiveTab] = useState("submit");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const navigate = useNavigate();

  const categories = [
    "Technical Issue",
    "Billing Problem",
    "Service Quality",
    "Security Concern",
    "Facility Issue",
    "Room Allocation",
    "Maintenance",
    "Other"
  ];

  const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
    { value: "REJECTED", label: "Rejected" }
  ];

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const user = localStorage.getItem("user");
    
    if (!isAuthenticated || !user) {
      alert("Please login to access complaints");
      navigate("/login");
      return;
    }
    
    // If authenticated, fetch complaints
    fetchComplaints();
  };

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = localStorage.getItem('userId') || user.id;
      
      console.log("Fetching complaints for user:", { userId, user });

      if (!userId) {
        alert("User not found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/complaints/my-complaints`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Complaints fetched:", data);
        setComplaints(data);
      } else if (response.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        console.error("Failed to fetch complaints:", response.status);
        alert("Failed to fetch complaints");
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = localStorage.getItem('userId') || user.id;

      if (!userId) {
        alert("Please login to submit a complaint");
        navigate("/login");
        return;
      }

      const complaintData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      };

      console.log("Submitting complaint:", complaintData);

      const response = await fetch('http://localhost:8080/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData)
      });

      if (response.ok) {
        const newComplaint = await response.json();
        setComplaints([newComplaint, ...complaints]);
        setFormData({
          title: "",
          category: "",
          description: "",
          priority: "MEDIUM"
        });
        alert("Complaint submitted successfully!");
        setActiveTab("manage");
      } else {
        const errorText = await response.text();
        console.error("Failed to submit complaint:", errorText);
        alert("Failed to submit complaint: " + errorText);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert("Error submitting complaint");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:8080/api/complaints/my-complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Refresh complaints list
        fetchComplaints();
        alert("Complaint status updated successfully!");
      } else {
        alert("Failed to update complaint status");
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert("Error updating complaint status");
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/complaints/my-complaints/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setComplaints(complaints.filter(complaint => complaint.id !== id));
        alert("Complaint deleted successfully!");
      } else {
        alert("Failed to delete complaint");
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert("Error deleting complaint");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "bg-yellow-500";
      case "IN_PROGRESS": return "bg-blue-500";
      case "RESOLVED": return "bg-green-500";
      case "CLOSED": return "bg-gray-500";
      case "REJECTED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "text-red-400";
      case "MEDIUM": return "text-yellow-400";
      case "LOW": return "text-green-400";
      case "URGENT": return "text-red-600";
      default: return "text-gray-400";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "HIGH": return "bg-red-500";
      case "MEDIUM": return "bg-yellow-500";
      case "LOW": return "bg-green-500";
      case "URGENT": return "bg-red-700";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "OPEN": return "Open";
      case "IN_PROGRESS": return "In Progress";
      case "RESOLVED": return "Resolved";
      case "CLOSED": return "Closed";
      case "REJECTED": return "Rejected";
      default: return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "HIGH": return "High";
      case "MEDIUM": return "Medium";
      case "LOW": return "Low";
      case "URGENT": return "Urgent";
      default: return priority;
    }
  };

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || complaint.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Display current user info
  const displayUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localStorage.getItem('userId');
    
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-[#00df9a] mb-2">Welcome, {user.name || 'User'}!</h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>Hall:</strong> {user.hallName || 'N/A'}</p>
              <p><strong>Role:</strong> <span className="capitalize">{user.role?.toLowerCase() || 'N/A'}</span></p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    );
  };

  // Calculate statistics
  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'OPEN').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    closed: complaints.filter(c => c.status === 'CLOSED').length,
    rejected: complaints.filter(c => c.status === 'REJECTED').length
  };

  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00df9a] mb-2">Complaint Management System</h1>
          <p className="text-gray-400">Submit and track your complaints efficiently</p>
        </div>

        {/* Display current user info */}
        {displayUserInfo()}

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          <button
            className={`py-3 px-6 font-semibold transition-all ${
              activeTab === "submit" 
                ? "text-[#00df9a] border-b-2 border-[#00df9a]" 
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("submit")}
          >
            Submit Complaint
          </button>
          <button
            className={`py-3 px-6 font-semibold transition-all ${
              activeTab === "manage" 
                ? "text-[#00df9a] border-b-2 border-[#00df9a]" 
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("manage")}
          >
            Manage Complaints ({complaints.length})
          </button>
        </div>

        {/* Submit Complaint Tab */}
        {activeTab === "submit" && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Submit New Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Complaint Title */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2 font-medium">
                    Complaint Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all"
                    placeholder="Brief description of your complaint"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2 font-medium">
                    Detailed Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all resize-vertical"
                    placeholder="Please provide detailed information about your complaint..."
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#00df9a] text-gray-900 font-bold rounded-lg hover:bg-[#00c785] transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:ring-opacity-50"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Manage Complaints Tab */}
        {activeTab === "manage" && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Your Complaints</h2>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  {complaints.length === 0 ? "No complaints submitted yet" : "No complaints match your search"}
                </div>
                {complaints.length === 0 && (
                  <button
                    onClick={() => setActiveTab("submit")}
                    className="px-6 py-2 bg-[#00df9a] text-gray-900 font-semibold rounded-lg hover:bg-[#00c785] transition-all"
                  >
                    Submit Your First Complaint
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {getStatusText(complaint.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(complaint.priority)}`}>
                          {getPriorityText(complaint.priority)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        <span>{formatDate(complaint.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                      <div className="mb-3 md:mb-0 flex-1">
                        <span className="inline-block bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm mr-3 mb-2">
                          {complaint.category}
                        </span>
                        <p className="text-gray-300 mt-2">{complaint.description}</p>
                        
                        {complaint.adminResponse && (
                          <div className="mt-3 p-3 bg-gray-600 rounded-lg">
                            <p className="text-sm text-gray-300 font-semibold">Admin Response:</p>
                            <p className="text-gray-300 mt-1">{complaint.adminResponse}</p>
                            {complaint.updatedAt && (
                              <p className="text-xs text-gray-400 mt-2">
                                Updated: {formatDate(complaint.updatedAt)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 flex-shrink-0">
                        <select
                          value={complaint.status}
                          onChange={(e) => updateComplaintStatus(complaint.id, e.target.value)}
                          className="bg-gray-600 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#00df9a]"
                          disabled={complaint.status === "RESOLVED" || complaint.status === "CLOSED" || complaint.status === "REJECTED"}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                        <button
                          onClick={() => deleteComplaint(complaint.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-all"
                          disabled={complaint.status === "IN_PROGRESS"}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Summary */}
        {complaints.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-[#00df9a]">{stats.total}</div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">{stats.open}</div>
              <div className="text-gray-400 text-sm">Open</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
              <div className="text-gray-400 text-sm">Resolved</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-gray-400">{stats.closed}</div>
              <div className="text-gray-400 text-sm">Closed</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
              <div className="text-gray-400 text-sm">Rejected</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaint;