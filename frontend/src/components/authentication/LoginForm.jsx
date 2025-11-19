import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation Rules
  const validate = () => {
    const { email, password } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@sust\.edu$/;

    if (!emailRegex.test(email)) {
      return "Only official SUST email is allowed (example: name@sust.edu).";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/users");

      if (!response.ok) {
        setError("Server error. Unable to connect.");
        return;
      }

      const users = await response.json();
      
    //  Find user by email AND check password
      const user = users.find((u) => 
        u.email === formData.email && u.password === formData.password
      );
     // const user = users.find((u) => u.email === formData.email );
      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      // Account status check
      if (user.accountStatus !== "APPROVED") {
        const msg = {
          PENDING: "Your account is pending approval. Please wait.",
          REJECTED: "Your account has been rejected. Contact administration.",
          SUSPENDED: "Your account has been suspended.",
        };
        setError(msg[user.accountStatus] || "Account not approved.");
        return;
      }

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userHall", user.hallName);

      console.log("User logged in:", {
        id: user.id,
        email: user.email,
        role: user.role,
        hallName: user.hallName
      });

      // Route based on user role
      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "CANTEEN_MANAGER":
          navigate("/canteen-dashboard");
          break;
        case "STAFF":
        case "TEACHER":
          navigate("/dashboard");
          break;
        case "STUDENT":
        default:
          navigate("/dashboard");
          break;
      }

    } catch (err) {
      console.error(err);
      setError("Network error. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  const getErrorStyle = () => {
    if (!error) return "";
    if (error.includes("pending")) return "bg-yellow-900/40 border border-yellow-700 text-yellow-200";
    if (error.includes("rejected") || error.includes("Invalid") || error.includes("error"))
      return "bg-red-900/40 border border-red-700 text-red-200";
    return "bg-gray-800/40 border border-gray-700 text-gray-200";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-black border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00df9a] mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your SUST account</p>
        </div>

        {error && (
          <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${getErrorStyle()}`}>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">SUST Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@sust.edu"
            onChange={handleChange}
            value={formData.email}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a]"
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-gray-300 mb-2 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            onChange={handleChange}
            value={formData.password}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white pr-12 focus:border-[#00df9a] focus:ring-1 focus:ring-[#00df9a]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-6">
          <label className="text-gray-400 text-sm flex items-center">
            <input type="checkbox" className="mr-2 bg-gray-800 border-gray-700" /> Remember me
          </label>
          <a className="text-[#00df9a] text-sm hover:text-white" href="#">
            Forgot password?
          </a>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-[#00df9a] text-black font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        {/* Register */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm mb-2">New to SUST Halls?</p>
          <Link
            to="/register"
            className="block w-full border border-[#00df9a] text-[#00df9a] py-3 rounded-lg hover:bg-[#00df9a] hover:text-black transition"
          >
            Create New Account
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Access restricted to SUST students and faculty.  
          New accounts require admin approval.
        </p>
      </form>
    </div>
  );
};

export default LoginForm;