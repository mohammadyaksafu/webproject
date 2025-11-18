import React, { useState } from "react";

const CreateUserTab = ({ onCreateUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hallName: "",
    role: "STUDENT",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const halls = [
    "Shah Paran Hall (SHPH)",
    "Bijoy 24 Hall (B24H)",
    "Syed Mujtaba Ali Hall (SMAH)",
    "Ayesha Siddiqa Hall (ASH)",
    "Begum Sirajunnesa Chowdhury Hall (BSCH)",
    "Fatimah Tuz Zahra Hall (FTZH)"
  ];

  const roles = [
    { value: "STUDENT", label: "Student" },
    { value: "STAFF", label: "Staff" },
    { value: "TEACHER", label: "Teacher" },
    { value: "CANTEEN_MANAGER", label: "Canteen Manager" },
    { value: "ADMIN", label: "Admin" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const success = await onCreateUser(formData);
    
    if (success) {
      setMessage("User created successfully!");
      setFormData({
        name: "",
        email: "",
        hallName: "",
        role: "STUDENT",
        password: "",
        confirmPassword: ""
      });
    } else {
      setMessage("Failed to create user. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Create New User</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes("successfully") 
            ? "bg-green-900 text-green-200" 
            : "bg-red-900 text-red-200"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00df9a]"
              placeholder="Enter full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00df9a]"
              placeholder="user@sust.edu"
            />
          </div>

          {/* Hall Selection */}
          <div>
            <label className="block text-gray-300 mb-2">Hall</label>
            <select
              name="hallName"
              value={formData.hallName}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00df9a]"
            >
              <option value="">Select Hall</option>
              {halls.map(hall => (
                <option key={hall} value={hall}>{hall}</option>
              ))}
            </select>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-300 mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00df9a]"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00df9a]"
              placeholder="Enter password"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00df9a]"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#00df9a] text-black font-semibold py-3 rounded-lg transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
          }`}
        >
          {loading ? "Creating User..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateUserTab;