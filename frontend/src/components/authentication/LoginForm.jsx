import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Client-side validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@sust\.edu$/;

    if (!emailRegex.test(email)) {
      setError("Only official SUST email is allowed (e.g., name@sust.edu)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get all users to find matching credentials
      const usersResponse = await fetch("http://localhost:8080/api/users");
      
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        
        // Find user by email
        const user = users.find(u => u.email === email);
        
        if (user) {
          // Check if user account is approved
          if (user.accountStatus !== 'APPROVED') {
            switch (user.accountStatus) {
              case 'PENDING':
                setError("Your account is pending approval. Please wait for admin approval.");
                break;
              case 'REJECTED':
                setError("Your account has been rejected. Please contact administration.");
                break;
              case 'SUSPENDED':
                setError("Your account has been suspended. Please contact administration.");
                break;
              default:
                setError("Your account is not approved for login.");
            }
            return;
          }

          console.log("Login Successful:", user);
          
          // Store user info in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          
          // Redirect based on role
          if (user.role === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("Failed to connect to server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
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
          <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${
            error.includes("pending approval") 
              ? "bg-yellow-900/50 border border-yellow-700 text-yellow-200"
              : error.includes("successful") 
              ? "bg-green-900/50 border border-green-700 text-green-200"
              : "bg-red-900/50 border border-red-700 text-red-200"
          }`}>
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
            disabled={loading}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200 disabled:opacity-50"
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
            disabled={loading}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a] transition-colors duration-200 disabled:opacity-50"
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-gray-400 text-sm">
            <input 
              type="checkbox" 
              className="mr-2 bg-gray-800 border-gray-700 text-[#00df9a] focus:ring-[#00df9a]" 
              disabled={loading}
            />
            Remember me
          </label>
          <a href="#" className="text-[#00df9a] hover:text-white text-sm transition-colors duration-200">
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
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
              Signing In...
            </div>
          ) : (
            "Login"
          )}
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
          <Link 
            to="/register" 
            className={`inline-block w-full border border-[#00df9a] text-[#00df9a] hover:bg-[#00df9a] hover:text-black font-semibold py-3 rounded-lg transition-all duration-200 ${
              loading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            Create New Account
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Access restricted to SUST students and faculty
          </p>
          <p className="text-xs text-gray-500 mt-1">
            New accounts require admin approval before login
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;