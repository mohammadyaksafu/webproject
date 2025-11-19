import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseForm, setResponseForm] = useState({
    adminResponse: "",
    note: "",
    status: ""
  });
  const [filter, setFilter] = useState("ALL");
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:8080/api/complaints";
      
      if (filter !== "ALL") {
        url = `http://localhost:8080/api/complaints/status/${filter}`;
      }
      
      const res = await axios.get(url);
      setComplaints(res.data);
      calculateStats(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load complaints.");
      setLoading(false);
    }
  };

  const calculateStats = (complaintsData) => {
    const stats = {
      total: complaintsData.length,
      open: complaintsData.filter(c => c.status === "OPEN").length,
      inProgress: complaintsData.filter(c => c.status === "IN_PROGRESS").length,
      resolved: complaintsData.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length
    };
    setStats(stats);
  };

  const handleStatusUpdate = async (complaintId, status, note = "") => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const updateData = {
        status: status,
        note: note,
        updatedBy: user.id,
        adminResponse: responseForm.adminResponse
      };

      const response = await axios.put(
        `http://localhost:8080/api/complaints/${complaintId}/status`,
        updateData
      );

      // Update the complaint in the local state
      setComplaints(prev => prev.map(c => 
        c.id === complaintId ? response.data : c
      ));

      setSelectedComplaint(null);
      setResponseForm({ adminResponse: "", note: "", status: "" });
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleQuickStatusUpdate = async (complaintId, status) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const updateData = {
        status: status,
        note: `Status changed to ${status}`,
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

  const handleAddNote = async (complaintId) => {
    if (!responseForm.note.trim()) {
      alert("Please enter a note.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const noteData = {
        note: responseForm.note,
        authorId: user.id
      };

      const response = await axios.post(
        `http://localhost:8080/api/complaints/${complaintId}/notes`,
        noteData
      );

      setComplaints(prev => prev.map(c => 
        c.id === complaintId ? response.data : c
      ));

      setResponseForm(prev => ({ ...prev, note: "" }));
      alert("Note added successfully!");
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note.");
    }
  };

  const openResponseModal = (complaint, status = "") => {
    setSelectedComplaint(complaint);
    setResponseForm({
      adminResponse: complaint.adminResponse || "",
      note: "",
      status: status || complaint.status
    });
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
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center py-5 text-gray-400">Loading complaints...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#00df9a]">Complaint Management</h1>
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

        {complaints.length === 0 ? (
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
            {complaints.map((complaint) => (
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
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openResponseModal(complaint)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Respond
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
                        <span className="text-green-300 text-xs">By Admin ID: {complaint.respondedBy}</span>
                      )}
                    </div>
                    <p className="text-green-300 leading-relaxed">{complaint.adminResponse}</p>
                  </div>
                )}

                {/* Notes History */}
                {complaint.notes && complaint.notes.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg">
                    <p className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-3">Activity Notes:</p>
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

                {/* Admin Actions */}
                <div className="mt-6 border-t border-gray-700 pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-sm font-semibold text-white">Quick Status Update:</p>
                    <div className="flex flex-wrap gap-2">
                      {["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED", "CLOSED"].map(status => (
                        <button
                          key={status}
                          onClick={() => handleQuickStatusUpdate(complaint.id, status)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
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

                  {/* Add Note Section */}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={responseForm.note}
                      onChange={(e) => setResponseForm(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="Add a note about this complaint..."
                      className="flex-1 p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 text-sm"
                    />
                    <button
                      onClick={() => handleAddNote(complaint.id)}
                      className="bg-purple-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Response Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Respond to Complaint</h3>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Official Response</label>
                    <textarea
                      value={responseForm.adminResponse}
                      onChange={(e) => setResponseForm(prev => ({ ...prev, adminResponse: e.target.value }))}
                      rows="4"
                      className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 resize-vertical bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Enter your official response to the student..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Status Update Note</label>
                    <input
                      type="text"
                      value={responseForm.note}
                      onChange={(e) => setResponseForm(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Add a note about the status change..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Update Status To</label>
                    <select
                      value={responseForm.status}
                      onChange={(e) => setResponseForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df9a] focus:border-transparent transition-all duration-200 bg-gray-800 text-white"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleStatusUpdate(selectedComplaint.id, responseForm.status, responseForm.note)}
                      className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] transition-colors duration-200 shadow-md hover:shadow-lg flex-1"
                    >
                      Save Response & Update Status
                    </button>
                    <button
                      onClick={() => setSelectedComplaint(null)}
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
    </div>
  );
}