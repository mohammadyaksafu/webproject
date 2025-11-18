import React from "react";

const AdminTabs = ({ activeTab, setActiveTab, pendingCount, allCount }) => {
  return (
    <div className="flex space-x-4 mb-6 border-b border-gray-700">
      <button
        onClick={() => setActiveTab("pending")}
        className={`pb-2 px-4 font-medium ${
          activeTab === "pending"
            ? "text-[#00df9a] border-b-2 border-[#00df9a]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Pending Approval ({pendingCount})
      </button>
      <button
        onClick={() => setActiveTab("all")}
        className={`pb-2 px-4 font-medium ${
          activeTab === "all"
            ? "text-[#00df9a] border-b-2 border-[#00df9a]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        All Users ({allCount})
      </button>
      <button
        onClick={() => setActiveTab("create")}
        className={`pb-2 px-4 font-medium ${
          activeTab === "create"
            ? "text-[#00df9a] border-b-2 border-[#00df9a]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Create User
      </button>
    </div>
  );
};

export default AdminTabs;