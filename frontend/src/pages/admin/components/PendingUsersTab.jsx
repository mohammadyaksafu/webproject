import React from "react";
import { getStatusBadge, getRoleBadge } from "../utils/badgeUtils";

const PendingUsersTab = ({ pendingUsers, onApprove, onReject }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Pending User Approvals</h2>
      {pendingUsers.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No pending users for approval</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">{user.name}</h3>
                <p className="text-gray-300 text-sm">{user.email}</p>
                <p className="text-gray-400 text-sm">{user.hallName}</p>
                <div className="flex space-x-2 mt-2">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.accountStatus)}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onApprove(user.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingUsersTab;