import React, { useState } from "react";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Allow ONLY name@sust.edu
    const emailRegex = /^[a-zA-Z0-9._%+-]+@sust\.edu$/;

    if (!emailRegex.test(email)) {
      setError("Only official SUST email is allowed (e.g., name@sust.edu)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    console.log("Login Successful:", formData);
    // TODO: connect Spring Boot API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00df9a] mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your SUST account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-6">
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

        {/* Password Field */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200"
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-gray-400 text-sm">
            <input type="checkbox" className="mr-2 bg-gray-800 border-gray-700 text-[#00df9a] focus:ring-[#00df9a]" />
            Remember me
          </label>
          <a href="#" className="text-[#00df9a] hover:text-white text-sm transition-colors duration-200">
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#00df9a] hover:bg-[#00c785] text-black font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-6"
        >
          Login
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">New to SUST Halls?</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <a 
            href="/register" 
            className="inline-block w-full border border-[#00df9a] text-[#00df9a] hover:bg-[#00df9a] hover:text-black font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Create New Account
          </a>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Access restricted to SUST students and faculty
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;