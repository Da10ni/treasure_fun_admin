import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3006/api";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    mobileNo: "",
    email: "",
    emailCode: "",
    referralCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleGetCode = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }

    setCodeLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/generate-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Verification code sent to your email!");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.message || "Failed to send verification code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error sending verification code:", error);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleLogin = async () => {
    // Client-side validation
    if (!formData.email || !formData.password || !formData.emailCode) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          emailCode: formData.emailCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message || "Login successful!");
        navigate("/");

        // Store token in localStorage (or handle as needed)
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Reset form
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          mobileNo: "",
          email: "",
          emailCode: "",
          referralCode: "",
        });

        // Redirect to dashboard or handle successful login
        setTimeout(() => {
          // window.location.href = "/dashboard"; // or use router navigation
          // You can also use useNavigate hook from react-router-dom
        }, 1500);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid = formData.email && formData.password && formData.emailCode;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="py-5 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Login as Admin</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Password Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Please enter your password"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
          disabled={loading}
        />
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Please enter your email"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400 mb-3"
          disabled={loading}
        />

        {/* Email Verification */}
        <div className="flex gap-2">
          <input
            type="text"
            name="emailCode"
            value={formData.emailCode}
            onChange={handleInputChange}
            placeholder="Email verification code"
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
            disabled={loading}
          />
          <button
            onClick={handleGetCode}
            disabled={codeLoading || !formData.email || loading}
            className="px-4 py-2.5 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {codeLoading ? "Sending..." : "Get"}
          </button>
        </div>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={!isFormValid || loading}
        className={`w-full py-3 px-4 rounded-md font-medium text-sm mb-4 transition-colors ${
          isFormValid && !loading
            ? "bg-cyan-400 text-white hover:bg-cyan-500 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Signup Link */}
      <div className="text-center">
        <span className="text-gray-600 text-sm">Don't have an account? </span>
        <Link
          to="/signup"
          className="text-cyan-400 hover:text-cyan-500 text-sm"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
