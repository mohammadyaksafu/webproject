import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Eye,
  EyeOff,
  Search,
  Filter
} from "lucide-react";

const HallManagementTab = ({ 
  halls, 
  onCreateHall, 
  onUpdateHall, 
  onDeleteHall, 
  onUpdateOccupancy 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showOccupancyForm, setShowOccupancyForm] = useState(null);

  // Filter halls based on search and type
  const filteredHalls = halls.filter(hall => {
    const matchesSearch = hall.hallName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.hallCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "All" || hall.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Initial form state for create/edit
  const initialFormState = {
    hallCode: "",
    hallName: "",
    fullName: "",
    type: "MALE",
    capacity: 0,
    currentOccupancy: 0,
    provost: "",
    email: "",
    phone: "",
    officeLocation: "",
    officeHours: "10:00 AM - 4:00 PM (Sat-Thu)",
    description: "",
    imageUrl: "",
    facilities: "",
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormState);
  const [occupancyData, setOccupancyData] = useState({ occupancy: 0 });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const success = await onCreateHall(formData);
    if (success) {
      setFormData(initialFormState);
      setShowCreateForm(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdateHall(editingHall.id, formData);
    if (success) {
      setEditingHall(null);
      setFormData(initialFormState);
    }
  };

  const handleOccupancySubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdateOccupancy(showOccupancyForm, occupancyData.occupancy);
    if (success) {
      setShowOccupancyForm(null);
      setOccupancyData({ occupancy: 0 });
    }
  };

  const startEdit = (hall) => {
    setEditingHall(hall);
    setFormData({
      hallCode: hall.hallCode || "",
      hallName: hall.hallName || "",
      fullName: hall.fullName || "",
      type: hall.type || "MALE",
      capacity: hall.capacity || 0,
      currentOccupancy: hall.currentOccupancy || 0,
      provost: hall.provost || "",
      email: hall.email || "",
      phone: hall.phone || "",
      officeLocation: hall.officeLocation || "",
      officeHours: hall.officeHours || "10:00 AM - 4:00 PM (Sat-Thu)",
      description: hall.description || "",
      imageUrl: hall.imageUrl || "",
      facilities: hall.facilities || "",
      isActive: hall.isActive !== undefined ? hall.isActive : true
    });
  };

  const getOccupancyPercentage = (capacity, occupancy) => {
    return capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;
  };

  const getOccupancyColor = (percentage) => {
    if (percentage < 60) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Building2 className="h-6 w-6 mr-2 text-[#00df9a]" />
            Hall Management
          </h2>
          <p className="text-gray-400 mt-1">Manage residential halls and occupancy</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 md:mt-0 bg-[#00df9a] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Hall
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search halls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
        >
          <option value="All">All Types</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingHall) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingHall ? 'Edit Hall' : 'Create New Hall'}
            </h3>
            <form onSubmit={editingHall ? handleUpdateSubmit : handleCreateSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Hall Code</label>
                  <input
                    type="text"
                    required
                    value={formData.hallCode}
                    onChange={(e) => setFormData({...formData, hallCode: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Hall Name</label>
                  <input
                    type="text"
                    required
                    value={formData.hallName}
                    onChange={(e) => setFormData({...formData, hallName: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Occupancy</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.currentOccupancy}
                    onChange={(e) => setFormData({...formData, currentOccupancy: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Provost</label>
                  <input
                    type="text"
                    value={formData.provost}
                    onChange={(e) => setFormData({...formData, provost: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={formData.officeLocation}
                    onChange={(e) => setFormData({...formData, officeLocation: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Facilities (comma separated)</label>
                  <input
                    type="text"
                    value={formData.facilities}
                    onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                    placeholder="Wi-Fi, Common Room, Dining, Library, Sports"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingHall(null);
                    setFormData(initialFormState);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00df9a] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  {editingHall ? 'Update Hall' : 'Create Hall'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Occupancy Update Modal */}
      {showOccupancyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Update Occupancy</h3>
            <form onSubmit={handleOccupancySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Occupancy
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={halls.find(h => h.id === showOccupancyForm)?.capacity || 0}
                  value={occupancyData.occupancy}
                  onChange={(e) => setOccupancyData({ occupancy: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Max capacity: {halls.find(h => h.id === showOccupancyForm)?.capacity}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOccupancyForm(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00df9a] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  Update Occupancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Halls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHalls.map((hall) => (
          <div key={hall.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{hall.hallName}</h3>
                <p className="text-gray-400 text-sm">{hall.hallCode}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                hall.type === "MALE" 
                  ? "bg-blue-900 text-blue-200" 
                  : "bg-pink-900 text-pink-200"
              }`}>
                {hall.type === "MALE" ? "Male" : "Female"}
              </span>
            </div>

            {/* Occupancy Info */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Occupancy</span>
                <span>{hall.currentOccupancy}/{hall.capacity} ({getOccupancyPercentage(hall.capacity, hall.currentOccupancy)}%)</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getOccupancyColor(getOccupancyPercentage(hall.capacity, hall.currentOccupancy))}`}
                  style={{ width: `${getOccupancyPercentage(hall.capacity, hall.currentOccupancy)}%` }}
                ></div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-gray-400 space-y-1 mb-4">
              {hall.provost && (
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-2" />
                  <span>Provost: {hall.provost}</span>
                </div>
              )}
              {hall.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  <span>{hall.phone}</span>
                </div>
              )}
              {hall.email && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2" />
                  <span>{hall.email}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(hall)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setShowOccupancyForm(hall.id)}
                className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center text-sm"
              >
                <Users className="h-3 w-3 mr-1" />
                Occupancy
              </button>
              <button
                onClick={() => onDeleteHall(hall.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </button>
            </div>

            {/* Status */}
            <div className="mt-3 flex justify-between items-center text-xs">
              <span className={`flex items-center ${hall.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {hall.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                {hall.isActive ? 'Active' : 'Inactive'}
              </span>
              {hall.facilities && (
                <span className="text-gray-500">
                  {hall.facilities.split(',').length} facilities
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredHalls.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No halls found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default HallManagementTab;