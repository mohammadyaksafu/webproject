import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/complaints/admin/${id}/status?status=${newStatus}`);
      
      // Update the complaint status in the local state
      setComplaints(prev => prev.map(c => 
        c.id === id ? response.data : c
      ));
      
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "RESOLVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      case "CLOSED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800";
      case "MEDIUM": return "bg-orange-100 text-orange-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p className="text-center py-5">Loading complaints...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <button
          onClick={fetchComplaints}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No complaints found.</p>
          <p className="text-gray-500">Submit your first complaint to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              {editingId === complaint.id ? (
                // Edit Form
                <div className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows="3"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(complaint.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold">{complaint.title}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(complaint)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">{complaint.description}</p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority} Priority
                    </span>
                    {complaint.category && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        {complaint.category}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Hall:</strong> {complaint.hallName || "N/A"}</p>
                      <p><strong>User:</strong> {complaint.userName || `ID: ${complaint.userId}`}</p>
                    </div>
                    <div>
                      <p><strong>Created:</strong> {formatDate(complaint.createdAt)}</p>
                      <p><strong>Updated:</strong> {formatDate(complaint.updatedAt)}</p>
                    </div>
                  </div>

                  {complaint.adminResponse && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 font-semibold">Admin Response:</p>
                      <p className="text-green-700 mt-1">{complaint.adminResponse}</p>
                    </div>
                  )}

                  {/* Admin Status Controls */}
                  {user && user.role === "ADMIN" && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-sm font-semibold mb-2">Admin Actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED", "CLOSED"].map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(complaint.id, status)}
                            className={`px-3 py-1 rounded text-xs ${
                              complaint.status === status 
                                ? "bg-blue-500 text-white" 
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
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
  );
}