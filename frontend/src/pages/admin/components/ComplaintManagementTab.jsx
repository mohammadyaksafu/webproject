import React, { useState } from "react";

const ComplaintManagementTab = ({ 
  complaints, 
  onUpdateStatus, 
  onAddNote, 
  onDeleteComplaint,
  onRefresh 
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseForm, setResponseForm] = useState({
    adminResponse: "",
    note: "",
    status: ""
  });
  const [filter, setFilter] = useState("ALL");
  const [quickNote, setQuickNote] = useState("");

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === "ALL") return true;
    return complaint.status === filter;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === "OPEN").length,
    inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
    resolved: complaints.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length
  };

  const openResponseModal = (complaint, status = "") => {
    setSelectedComplaint(complaint);
    setResponseForm({
      adminResponse: complaint.adminResponse || "",
      note: "",
      status: status || complaint.status
    });
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const updateData = {
      status: responseForm.status,
      note: responseForm.note,
      updatedBy: user.id,
      adminResponse: responseForm.adminResponse
    };

    const success = await onUpdateStatus(selectedComplaint.id, updateData);
    if (success) {
      setSelectedComplaint(null);
      setResponseForm({ adminResponse: "", note: "", status: "" });
    }
  };

  const handleQuickStatusUpdate = async (complaintId, status) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const updateData = {
      status: status,
      note: `Status changed to ${status}`,
      updatedBy: user.id
    };

    await onUpdateStatus(complaintId, updateData);
  };

  const handleAddQuickNote = async (complaintId) => {
    if (!quickNote.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const noteData = {
      note: quickNote,
      authorId: user.id
    };

    const success = await onAddNote(complaintId, noteData);
    if (success) {
      setQuickNote("");
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

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>
        <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.open}</div>
          <div className="text-yellow-400 text-sm">Open</div>
        </div>
        <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
          <div className="text-blue-400 text-sm">In Progress</div>
        </div>
        <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
          <div className="text-green-400 text-sm">Resolved</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            filter === "ALL" 
              ? "bg-[#00df9a] text-black shadow-md" 
              : "bg-gray-700 text-white hover:bg-gray-600"
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
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{complaint.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {complaint.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openResponseModal(complaint)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Respond
                </button>
              </div>
            </div>

            <p className="text-gray-300 mb-4 bg-gray-800 p-3 rounded-lg border border-gray-700">
              {complaint.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
              <div>
                <p><strong className="text-white">User:</strong> {complaint.userName || `ID: ${complaint.userId}`}</p>
                <p><strong className="text-white">Created:</strong> {formatDate(complaint.createdAt)}</p>
              </div>
              <div>
                <p><strong className="text-white">Updated:</strong> {formatDate(complaint.updatedAt)}</p>
                {complaint.resolvedAt && (
                  <p><strong className="text-white">Resolved:</strong> {formatDate(complaint.resolvedAt)}</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-700 pt-4">
              <div className="flex flex-wrap gap-2">
                {["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED", "CLOSED"].map(status => (
                  <button
                    key={status}
                    onClick={() => handleQuickStatusUpdate(complaint.id, status)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      complaint.status === status 
                        ? "bg-[#00df9a] text-black" 
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Add quick note..."
                  className="px-3 py-1 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                />
                <button
                  onClick={() => handleAddQuickNote(complaint.id)}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Add Note
                </button>
                <button
                  onClick={() => onDeleteComplaint(complaint.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Respond to Complaint</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Official Response</label>
                  <textarea
                    value={responseForm.adminResponse}
                    onChange={(e) => setResponseForm(prev => ({ ...prev, adminResponse: e.target.value }))}
                    rows="4"
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    placeholder="Enter your official response..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Status Note</label>
                  <input
                    type="text"
                    value={responseForm.note}
                    onChange={(e) => setResponseForm(prev => ({ ...prev, note: e.target.value }))}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    placeholder="Add a note about status change..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Update Status</label>
                  <select
                    value={responseForm.status}
                    onChange={(e) => setResponseForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
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
                    onClick={handleStatusUpdate}
                    className="bg-[#00df9a] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00c389] flex-1"
                  >
                    Save Response
                  </button>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 flex-1"
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

export default ComplaintManagementTab;