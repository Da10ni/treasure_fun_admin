import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const API_BASE = "https://treasure-fun-backend.vercel.app/api";

// Signup Form Component
const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetCode = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setCodeLoading(true);

    // Show loading toast
    const loadingToast = toast.loading("Sending verification code...", {
      position: "top-right",
    });

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

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("📧 Verification code sent to your email!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.message || "Failed to send verification code", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please check your connection and try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error sending verification code:", error);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSignup = async () => {
    // Client-side validation
    if (
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.emailCode
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.emailCode.length < 4) {
      toast.error("Please enter a valid verification code", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...", {
      position: "top-right",
    });

    try {
      const response = await fetch(`${API_BASE}/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          verificationCode: formData.emailCode,
        }),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success(`🎉 Registration successful! Welcome ${data.data.user.username}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Clear form
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          emailCode: "",
        });

        // Show redirect toast
        toast.info("Redirecting to dashboard...", {
          position: "top-right",
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.message || "Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please check your connection and try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid =
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    formData.email &&
    formData.emailCode &&
    formData.password === formData.confirmPassword;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="py-5 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Signup as Admin</h1>
      </div>

      {/* Username Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          User name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Please enter user name"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
          disabled={loading}
        />
      </div>

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

      {/* Confirm Password Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Confirm password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Please re-enter your password"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
          disabled={loading}
        />
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
        )}
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
            className="px-4 py-2.5 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[80px]"
          >
            {codeLoading ? "Sending..." : "Get"}
          </button>
        </div>
      </div>

      {/* Sign Up Button */}
      <button
        onClick={handleSignup}
        disabled={!isFormValid || loading}
        className={`w-full py-3 px-4 rounded-md font-medium text-sm mb-4 transition-colors ${
          isFormValid && !loading
            ? "bg-cyan-400 text-white hover:bg-cyan-500 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>

      {/* Login Link */}
      <div className="text-center">
        <span className="text-gray-600 text-sm">Have an account? </span>
        <Link 
          to="/login" 
          className="text-cyan-400 hover:text-cyan-500 text-sm"
          onClick={() => {
            toast.info("Redirecting to login...", {
              position: "top-right",
              autoClose: 1500,
            });
          }}
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;