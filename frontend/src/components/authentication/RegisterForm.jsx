import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hallName: "", 
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHallDropdown, setShowHallDropdown] = useState(false);
  const navigate = useNavigate();

  const halls = [
    { value: "Shah Paran Hall", label: "Shah Paran Hall" },
    { value: "Bijoy 24 Hall", label: "Bijoy 24 Hall" },
    { value: "Syed Mujtaba Ali Hall", label: "Syed Mujtaba Ali Hall" },
    { value: "Ayesha Siddiqa Hall", label: "Ayesha Siddiqa Hall" },
    { value: "Begum Sirajunnesa Chowdhury Hall", label: "Begum Sirajunnesa Chowdhury Hall" },
    { value: "Fatimah Tuz Zahra Hall", label: "Fatimah Tuz Zahra Hall" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHallSelect = (hallValue) => {
    setFormData({ ...formData, hallName: hallValue }); 
    setShowHallDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, hallName, password, confirmPassword } = formData;

   
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*sust\.edu$/;

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Only official SUST email is allowed (e.g., name@department.sust.edu)");
      return;
    }

    if (!hallName) {
      setError("Please select your hall.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          hallName: formData.hallName,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log("Registration Successful:", user);
        
        setError(""); 
        alert("Registration successful! You can now login.");

        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const selectedHallLabel = halls.find(hall => hall.value === formData.hallName)?.label || "Select your hall";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00df9a] mb-2">Create Account</h2>
          <p className="text-gray-400">Join SUST Hall Management System</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${
            error.includes("successful") 
              ? "bg-green-900/50 border border-green-700 text-green-200" 
              : "bg-red-900/50 border border-red-700 text-red-200"
          }`}>
            {error}
          </div>
        )}

        {/* Full Name Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200"
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-300">SUST Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@sust.edu"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200"
            disabled={loading}
          />
        </div>

        {/* Hall Selection Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-300">Hall Name</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHallDropdown(!showHallDropdown)}
              disabled={loading}
              className={`w-full bg-gray-900 border ${
                formData.hallName ? 'border-[#00df9a]' : 'border-gray-700'
              } rounded-lg px-4 py-3 text-left text-white focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200 flex items-center justify-between ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className={formData.hallName ? "text-white" : "text-gray-500"}>
                {selectedHallLabel}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showHallDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showHallDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                {halls.map((hall) => (
                  <button
                    key={hall.value}
                    type="button"
                    onClick={() => handleHallSelect(hall.value)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors duration-200 ${
                      formData.hallName === hall.value 
                        ? 'bg-[#00df9a] text-black font-semibold' 
                        : 'text-white'
                    } first:rounded-t-lg last:rounded-b-lg`}
                  >
                    {hall.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-300">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200"
            disabled={loading}
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#00df9a] hover:bg-[#00c785] text-black font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-6 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">Already have an account?</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <Link 
            to="/login" 
            className={`inline-block w-full border border-[#00df9a] text-[#00df9a] hover:bg-[#00df9a] hover:text-black font-semibold py-3 rounded-lg transition-all duration-200 ${
              loading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            Sign In to Existing Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;