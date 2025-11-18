import React from "react";
import { getStatusColor, getPriorityBadgeColor, formatDate } from "./helpers";

export default function ComplaintList({
  complaints,
  updateStatus,
  deleteComplaint,
  search,
  filterStatus
}) {
  const filtered = complaints.filter((c) => {
    const s = search.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s) ||
      c.category.toLowerCase().includes(s);

    const matchesStatus =
      filterStatus === "ALL" || c.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {filtered.map((complaint) => (
        <div
          key={complaint.id}
          className="bg-gray-700 rounded-lg p-4 border border-gray-600"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-white">{complaint.title}</h3>

            <span className={`px-2 py-1 rounded ${getStatusColor(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>

          <p className="text-gray-300 mt-2">{complaint.description}</p>

          <div className="text-gray-400 text-sm mt-2">
            {formatDate(complaint.createdAt)}
          </div>

          <div className="mt-3 flex gap-2">
            <select
              value={complaint.status}
              onChange={(e) => updateStatus(complaint.id, e.target.value)}
              className="bg-gray-600 text-white px-2 py-1 rounded"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <button
              onClick={() => deleteComplaint(complaint.id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
