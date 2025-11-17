import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hall: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showHallDropdown, setShowHallDropdown] = useState(false);

  const halls = [
    { value: "shph", label: "Shah Paran Hall (SHPH)" },
    { value: "b24h", label: "Bijoy 24 Hall (B24H)" },
    { value: "smah", label: "Syed Mujtaba Ali Hall (SMAH)" },
    { value: "ash", label: "Ayesha Siddiqa Hall (ASH)" },
    { value: "bsch", label: "Begum Sirajunnesa Chowdhury Hall (BSCH)" },
    { value: "ftzh", label: "Fatimah Tuz Zahra Hall (FTZH)" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHallSelect = (hallValue, hallLabel) => {
    setFormData({ ...formData, hall: hallValue });
    setShowHallDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, hall, password, confirmPassword } = formData;

    // Allow ONLY @sust.edu
    const emailRegex = /^[a-zA-Z0-9._%+-]+@sust\.edu$/;

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Only official SUST email is allowed (e.g., name@sust.edu)");
      return;
    }

    if (!hall) {
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

    setError("");
    console.log("Registration Successful:", formData);
    // TODO: connect to Spring Boot API
  };

  const selectedHallLabel = halls.find(hall => hall.value === formData.hall)?.label || "Select your hall";

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
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
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
          />
        </div>

        {/* Hall Selection Field */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-300">Hall Name</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHallDropdown(!showHallDropdown)}
              className={`w-full bg-gray-900 border ${
                formData.hall ? 'border-[#00df9a]' : 'border-gray-700'
              } rounded-lg px-4 py-3 text-left text-white focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200 flex items-center justify-between`}
            >
              <span className={formData.hall ? "text-white" : "text-gray-500"}>
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
                    onClick={() => handleHallSelect(hall.value, hall.label)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors duration-200 ${
                      formData.hall === hall.value 
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
          />
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6">
          <label className="flex items-start text-gray-400 text-sm">
            <input 
              type="checkbox" 
              className="mr-2 bg-gray-800 border-gray-700 text-[#00df9a] focus:ring-[#00df9a] mt-1" 
              required
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-[#00df9a] hover:text-white transition-colors duration-200">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#00df9a] hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-[#00df9a] hover:bg-[#00c785] text-black font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-6"
        >
          Create Account
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
            className="inline-block w-full border border-[#00df9a] text-[#00df9a] hover:bg-[#00df9a] hover:text-black font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Sign In to Existing Account
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Registration requires valid SUST email address
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;