import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [note, setNote] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/complaints");
      setComplaints(response.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      alert("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const updateData = {
        status: newStatus,
        note: `Status changed to ${newStatus}`,
        updatedBy: user.id
      };

      const response = await axios.put(
        `http://localhost:8080/api/complaints/${complaintId}/status`,
        updateData
      );
      
      setComplaints(prev => prev.map(c => 
        c.id === complaintId ? response.data : c
      ));
      
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleAddNote = async (complaint) => {
    setSelectedComplaint(complaint);
    setNote("");
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!selectedComplaint || !note.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const noteData = {
        note: note,
        authorId: user.id
      };

      const response = await axios.post(
        `http://localhost:8080/api/complaints/${selectedComplaint.id}/notes`,
        noteData
      );
      
      setComplaints(prev => prev.map(c => 
        c.id === selectedComplaint.id ? response.data : c
      ));
      
      setShowNoteModal(false);
      setNote("");
      setSelectedComplaint(null);
      alert("Note added successfully!");
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note.");
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

  // Filter complaints based on selected filter
  const filteredComplaints = complaints.filter(complaint => {
    if (filter === "ALL") return true;
    return complaint.status === filter;
  });

  // Calculate statistics
  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === "OPEN").length,
    inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
    resolved: complaints.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#00df9a]">Staff Complaint Dashboard</h1>
              <p className="text-gray-400 mt-2">Manage and respond to student complaints</p>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-gray-400 text-sm">Total</div>
              </div>
              <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-lg text-center border border-yellow-800">
                <div className="text-2xl font-bold text-yellow-400">{stats.open}</div>
                <div className="text-yellow-400 text-sm">Open</div>
              </div>
              <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg text-center border border-blue-800">
                <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
                <div className="text-blue-400 text-sm">In Progress</div>
              </div>
              <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg text-center border border-green-800">
                <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
                <div className="text-green-400 text-sm">Resolved</div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === "ALL" 
                  ? "bg-[#00df9a] text-black shadow-md" 
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              All Complaints
            </button>
            {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  filter === status 
                    ? "bg-[#00df9a] text-black shadow-md" 
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={fetchAllComplaints}
            className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? "Refreshing..." : "Refresh Complaints"}
          </button>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 rounded-xl shadow-sm border border-gray-800">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No complaints found</h3>
            <p className="text-gray-400 mb-6">
              {filter === "ALL" 
                ? "There are no complaints in the system." 
                : `No complaints with status: ${filter}`
              }
            </p>
            {filter !== "ALL" && (
              <button
                onClick={() => setFilter("ALL")}
                className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200"
              >
                View All Complaints
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="p-6 border border-gray-800 rounded-xl shadow-sm bg-gray-900 hover:shadow-lg transition-all duration-300"
              >
                {/* Complaint Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{complaint.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} Priority
                      </span>
                      {complaint.category && (
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {complaint.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAddNote(complaint)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Complaint Description */}
                <p className="text-gray-300 mt-2 mb-4 whitespace-pre-wrap leading-relaxed bg-gray-800 p-4 rounded-lg border border-gray-700">
                  {complaint.description}
                </p>

                {/* User Information */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700">
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
                        <span className="text-green-300 text-xs">By Staff ID: {complaint.respondedBy}</span>
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

                {/* Status Update Section */}
                <div className="mt-6 border-t border-gray-700 pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-sm font-semibold text-white">Update Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED", "CLOSED"].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(complaint.id, status)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            complaint.status === status 
                              ? "bg-[#00df9a] text-black shadow-md" 
                              : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-sm"
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Add Note to Complaint</h3>
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Complaint: {selectedComplaint?.title}
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows="6"
                    className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 resize-vertical bg-gray-800 text-white placeholder-gray-400"
                    placeholder="Enter your notes or internal comments about this complaint..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveNote}
                    className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setShowNoteModal(false)}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;