import React from "react";
import { getStatusBadge } from "../utils/badgeUtils";

const AllUsersTab = ({ allUsers, onRoleChange, onApprove, onReject, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Hall</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.hallName}</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className="bg-gray-600 text-white rounded px-2 py-1 text-sm"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="STAFF">Staff</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="CANTEEN_MANAGER">Canteen Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="p-3">{getStatusBadge(user.accountStatus)}</td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    {user.accountStatus === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onApprove(user.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {user.accountStatus === 'APPROVED' && (
                      <button
                        onClick={() => onRoleChange(user.id, 'SUSPENDED')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-semibold"
                      >
                        Suspend
                      </button>
                    )}
                    {user.accountStatus === 'SUSPENDED' && (
                      <button
                        onClick={() => onApprove(user.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersTab;