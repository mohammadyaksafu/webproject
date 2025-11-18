import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import AdminTabs from "./components/AdminTabs";
import PendingUsersTab from "./components/PendingUsersTab";
import AllUsersTab from "./components/AllUsersTab";
import CreateUserTab from "./components/CreateUserTab";
import HallManagementTab from "./components/HallManagementTab";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is admin
  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-300">Only administrators can access this page.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-[#00df9a] text-black px-6 py-2 rounded-md font-semibold hover:bg-white transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [pendingResponse, allResponse, hallsResponse] = await Promise.all([
        fetch('http://localhost:8080/api/admin/pending-users'),
        fetch('http://localhost:8080/api/admin/users'),
        fetch('http://localhost:8080/api/halls')
      ]);

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingUsers(pendingData);
      }

      if (allResponse.ok) {
        const allData = await allResponse.json();
        setAllUsers(allData);
      }

      if (hallsResponse.ok) {
        const hallsData = await hallsResponse.json();
        setHalls(hallsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/approve`, {
        method: 'POST'
      });

      if (response.ok) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/reject`, {
        method: 'POST'
      });

      if (response.ok) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchAllData();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        fetchAllData();
        setActiveTab("all");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };

  // Hall Management Functions
  const handleCreateHall = async (hallData) => {
    try {
      const response = await fetch('http://localhost:8080/api/halls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hallData)
      });

      if (response.ok) {
        fetchAllData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating hall:', error);
      return false;
    }
  };

  const handleUpdateHall = async (id, hallData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/halls/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hallData)
      });

      if (response.ok) {
        fetchAllData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating hall:', error);
      return false;
    }
  };

  const handleDeleteHall = async (id) => {
    if (window.confirm('Are you sure you want to delete this hall?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/halls/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchAllData();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error deleting hall:', error);
        return false;
      }
    }
  };

  const handleUpdateOccupancy = async (id, occupancy) => {
    try {
      const response = await fetch(`http://localhost:8080/api/halls/${id}/occupancy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ occupancy })
      });

      if (response.ok) {
        fetchAllData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating occupancy:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">Loading Admin Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <AdminHeader navigate={navigate} />
        
        <AdminTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={pendingUsers.length}
          allCount={allUsers.length}
          hallsCount={halls.length}
        />

        {/* Pending Users Tab */}
        {activeTab === "pending" && (
          <PendingUsersTab 
            pendingUsers={pendingUsers}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {/* All Users Tab */}
        {activeTab === "all" && (
          <AllUsersTab 
            allUsers={allUsers}
            onRoleChange={handleRoleChange}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDeleteUser}
          />
        )}

        {/* Create User Tab */}
        {activeTab === "create" && (
          <CreateUserTab onCreateUser={handleCreateUser} />
        )}

        {/* Hall Management Tab */}
        {activeTab === "halls" && (
          <HallManagementTab 
            halls={halls}
            onCreateHall={handleCreateHall}
            onUpdateHall={handleUpdateHall}
            onDeleteHall={handleDeleteHall}
            onUpdateOccupancy={handleUpdateOccupancy}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;