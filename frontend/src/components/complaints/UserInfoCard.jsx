import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserInfoCard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-[#00df9a] mb-2">
            Welcome, {user.name || "User"}!
          </h3>
          <div className="text-gray-300 text-sm space-y-1">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Hall:</strong> {user.hallName}</p>
            <p><strong>Role:</strong> {user.role?.toLowerCase()}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
