// import React, { useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//     mobileNo: "",
//     email: "",
//     emailCode: "",
//     referralCode: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [codeLoading, setCodeLoading] = useState(false);
//   const token = localStorage.getItem("authToken");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleGetCode = async () => {
//     if (!formData.email) {
//       toast.error("Please enter your email first", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//       return;
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     setCodeLoading(true);

//     // Show loading toast
//     const loadingToast = toast.loading("Sending verification code...", {
//       position: "top-right",
//     });

//     try {
//       const response = await fetch(`${API_BASE}/auth/generate-code`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//         }),
//       });

//       const data = await response.json();

//       // Dismiss loading toast
//       toast.dismiss(loadingToast);

//       if (data.success) {
//         toast.success("📧 Verification code sent to your email!", {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//       } else {
//         toast.error(data.message || "Failed to send verification code", {
//           position: "top-right",
//           autoClose: 5000,
//         });
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Network error. Please check your connection and try again.", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//       console.error("Error sending verification code:", error);
//     } finally {
//       setCodeLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     // Client-side validation
//     if (!formData.email || !formData.password || !formData.emailCode) {
//       toast.error("All fields are required!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     // Password validation
//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters long", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     // Email code validation
//     if (formData.emailCode.length < 4) {
//       toast.error("Please enter a valid verification code", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     setLoading(true);

//     // Show loading toast
//     const loadingToast = toast.loading("Logging you in...", {
//       position: "top-right",
//     });

//     try {
//       const response = await fetch(`${API_BASE}/admin/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//           emailCode: formData.emailCode,
//         }),
//       });

//       const data = await response.json();

//       // Dismiss loading toast
//       toast.dismiss(loadingToast);

//       if (data.success) {
//         // Store token in localStorage
//         localStorage.setItem("authToken", data.data.token);
//         localStorage.setItem("user", JSON.stringify(data.data.user));

//         // Show success toast
//         toast.success(`🎉 Welcome back, ${data.data.user.username || 'Admin'}!`, {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });

//         // Reset form
//         setFormData({
//           username: "",
//           password: "",
//           confirmPassword: "",
//           mobileNo: "",
//           email: "",
//           emailCode: "",
//           referralCode: "",
//         });

//         // Show redirect toast
//         toast.info("Redirecting to dashboard...", {
//           position: "top-right",
//           autoClose: 1500,
//         });

//         // Redirect to dashboard
//         setTimeout(() => {
//           navigate("/");
//         }, 1500);
//       } else {
//         // Handle specific error messages
//         const errorMessage = data.message || "Login failed";
        
//         if (errorMessage.toLowerCase().includes('invalid')) {
//           toast.error("❌ Invalid credentials. Please check your email and password.", {
//             position: "top-right",
//             autoClose: 5000,
//           });
//         } else if (errorMessage.toLowerCase().includes('verification')) {
//           toast.error("❌ Invalid verification code. Please request a new code.", {
//             position: "top-right",
//             autoClose: 5000,
//           });
//         } else if (errorMessage.toLowerCase().includes('expired')) {
//           toast.error("❌ Verification code has expired. Please request a new code.", {
//             position: "top-right",
//             autoClose: 5000,
//           });
//         } else {
//           toast.error(errorMessage, {
//             position: "top-right",
//             autoClose: 5000,
//           });
//         }
//       }
//     } catch (error) {
//       toast.dismiss(loadingToast);
      
//       // Handle network errors
//       if (error.name === 'TypeError' && error.message.includes('fetch')) {
//         toast.error("❌ Unable to connect to server. Please check your internet connection.", {
//           position: "top-right",
//           autoClose: 5000,
//         });
//       } else {
//         toast.error("❌ Network error. Please try again.", {
//           position: "top-right",
//           autoClose: 5000,
//         });
//       }
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if form is valid for enabling submit button
//   const isFormValid = formData.email && formData.password && formData.emailCode;

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="py-5 flex items-center justify-center">
//         <h1 className="text-3xl font-bold">Login as Admin</h1>
//       </div>

//       {/* Password Field */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Password<span className="text-red-500">*</span>
//         </label>
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleInputChange}
//           placeholder="Please enter your password"
//           className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
//           disabled={loading}
//         />
//         {formData.password && formData.password.length < 6 && (
//           <p className="text-orange-500 text-xs mt-1">Password should be at least 6 characters</p>
//         )}
//       </div>

//       {/* Email Field */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Email<span className="text-red-500">*</span>
//         </label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           placeholder="Please enter your email"
//           className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400 mb-3"
//           disabled={loading}
//         />

//         {/* Email Verification */}
//         <div className="flex gap-2">
//           <input
//             type="text"
//             name="emailCode"
//             value={formData.emailCode}
//             onChange={handleInputChange}
//             placeholder="Email verification code"
//             className="flex-1 px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
//             disabled={loading}
//           />
//           <button
//             onClick={handleGetCode}
//             disabled={codeLoading || !formData.email || loading}
//             className="px-4 py-2.5 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[80px]"
//           >
//             {codeLoading ? "Sending..." : "Get"}
//           </button>
//         </div>
//       </div>

//       {/* Login Button */}
//       <button
//         onClick={handleLogin}
//         disabled={!isFormValid || loading}
//         className={`w-full py-3 px-4 rounded-md font-medium text-sm mb-4 transition-colors ${
//           isFormValid && !loading
//             ? "bg-cyan-400 text-white hover:bg-cyan-500 cursor-pointer"
//             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//         }`}
//       >
//         {loading ? "Logging in..." : "Login"}
//       </button>

//       {/* Signup Link */}
//       <div className="text-center">
//         <span className="text-gray-600 text-sm">Don't have an account? </span>
//         <Link
//           to="/signup"
//           className="text-cyan-400 hover:text-cyan-500 text-sm"
//           onClick={() => {
//             toast.info("Redirecting to signup...", {
//               position: "top-right",
//               autoClose: 1500,
//             });
//           }}
//         >
//           Signup
//         </Link>
//       </div>

//       {/* Additional Help */}
//       <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//         <h3 className="text-sm font-medium text-blue-800 mb-2">Need help?</h3>
//         <ul className="text-xs text-blue-600 space-y-1">
//           <li>• Make sure you enter a valid email address</li>
//           <li>• Request a new verification code if the current one expired</li>
//           <li>• Check your spam folder for the verification email</li>
//           <li>• Contact support if you continue having issues</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    totpToken: "",
  });

  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [setupStep, setSetupStep] = useState('initial'); // 'initial', 'qr', 'verify', 'complete'
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Download QR Code function
  const downloadQRCode = () => {
    if (!qrCodeData?.qrCode) return;
    
    const link = document.createElement('a');
    link.download = `google-authenticator-${formData.email || 'admin'}.png`;
    link.href = qrCodeData.qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("📥 QR code downloaded!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleGenerateQR = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first", {
        position: "top-right",
        autoClose: 3000,
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

    setQrLoading(true);
    const loadingToast = toast.loading("Generating QR code...", {
      position: "top-right",
    });

    try {
      const response = await fetch(`${API_BASE}/admin/generate-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        setQrCodeData(data.data);
        setShowQRCode(true);
        
        // Check if already setup complete
        if (data.data.setupComplete) {
          setSetupStep('complete');
          setIsSetupComplete(true);
          toast.success("✅ Google Authenticator already set up! You can login now.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          setSetupStep('qr');
          toast.success("📱 QR Code generated! Scan with Google Authenticator", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else {
        toast.error(data.message || "Failed to generate QR code", {
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
      console.error("Error generating QR code:", error);
    } finally {
      setQrLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!formData.totpToken) {
      toast.error("Please enter the 6-digit code from Google Authenticator", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.totpToken.length !== 6) {
      toast.error("TOTP code must be exactly 6 digits", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Verifying setup...", {
      position: "top-right",
    });

    try {
      const response = await fetch(`${API_BASE}/admin/verify-totp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          totpToken: formData.totpToken,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        setSetupStep('complete');
        setIsSetupComplete(true);
        toast.success("🎉 Google Authenticator setup complete! You can now login.", {
          position: "top-right",
          autoClose: 5000,
        });
        setShowQRCode(false);
        // Don't clear totpToken here, let user use it for login
      } else {
        toast.error(data.message || "Setup verification failed", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error verifying setup:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    // Client-side validation
    if (!formData.email || !formData.password || !formData.totpToken) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // TOTP validation
    if (formData.totpToken.length !== 6) {
      toast.error("Please enter a valid 6-digit TOTP code", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Logging you in...", {
      position: "top-right",
    });

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          totpToken: formData.totpToken,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        toast.success(`🎉 Welcome back, ${data.data.user.username || 'Admin'}!`, {
          position: "top-right",
          autoClose: 3000,
        });

        // Reset form
        setFormData({
          email: "",
          password: "",
          totpToken: "",
        });

        toast.info("Redirecting to dashboard...", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorMessage = data.message || "Login failed";
        
        if (errorMessage.toLowerCase().includes('totp')) {
          toast.error("❌ Invalid or expired Google Authenticator code. Please try again.", {
            position: "top-right",
            autoClose: 5000,
          });
        } else if (errorMessage.toLowerCase().includes('credentials')) {
          toast.error("❌ Invalid credentials. Please check your email and password.", {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error("❌ Unable to connect to server. Please check your internet connection.", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error("❌ Network error. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && formData.totpToken;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="py-5 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Login as Admin</h1>
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
        {formData.password && formData.password.length < 6 && (
          <p className="text-orange-500 text-xs mt-1">Password should be at least 6 characters</p>
        )}
      </div>

      {/* Google Authenticator Setup */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Google Authenticator
        </label>
        
        {setupStep === 'initial' && (
          <div className="space-y-3">
            <button
              onClick={handleGenerateQR}
              disabled={qrLoading || !formData.email || loading}
              className="w-full px-4 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {qrLoading ? "Generating..." : "🔐 Setup Google Authenticator"}
            </button>
            <p className="text-xs text-gray-600">
              First time? Click above to setup Google Authenticator
            </p>
          </div>
        )}

        {(setupStep === 'qr' || setupStep === 'verify') && showQRCode && qrCodeData && !isSetupComplete && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border text-center">
              <h3 className="text-sm font-medium mb-3">Scan this QR code with Google Authenticator</h3>
              <div className="relative">
                <img 
                  src={qrCodeData.qrCode} 
                  alt="Google Authenticator QR Code" 
                  className="mx-auto mb-3 max-w-48"
                />
                <button
                  onClick={downloadQRCode}
                  className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors text-xs"
                  title="Download QR Code"
                >
                  📥
                </button>
              </div>
              <button
                onClick={downloadQRCode}
                className="mb-3 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                📥 Download QR Code
              </button>
              <p className="text-xs text-gray-600 mb-2">
                Can't scan? Enter this code manually:
              </p>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                {qrCodeData.secret}
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                name="totpToken"
                value={formData.totpToken}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                maxLength="6"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
                disabled={loading}
              />
              <button
                onClick={handleVerifySetup}
                disabled={loading || formData.totpToken.length !== 6}
                className="px-4 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify Setup"}
              </button>
            </div>
            <p className="text-xs text-orange-600">
              ⚠️ After verification, you can use the same code or a new one to login
            </p>
          </div>
        )}

        {(setupStep === 'complete' || isSetupComplete) && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ Google Authenticator is set up!</p>
            </div>
            
            <input
              type="text"
              name="totpToken"
              value={formData.totpToken}
              onChange={handleInputChange}
              placeholder="Enter current 6-digit code from app"
              maxLength="6"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-sm placeholder-gray-400"
              disabled={loading}
            />
            <p className="text-xs text-gray-600">
              💡 Enter a fresh code from your Google Authenticator app
            </p>
          </div>
        )}
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={!isFormValid || loading || (setupStep !== 'complete' && !isSetupComplete)}
        className={`w-full py-3 px-4 rounded-md font-medium text-sm mb-4 transition-colors ${
          isFormValid && !loading && (setupStep === 'complete' || isSetupComplete)
            ? "bg-cyan-400 text-white hover:bg-cyan-500 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>


      {/* Help Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">How to use Google Authenticator:</h3>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>1. Download Google Authenticator app from your app store</li>
          <li>2. Click "Setup Google Authenticator" button</li>
          <li>3. Scan the QR code with your phone</li>
          <li>4. Enter the 6-digit code to verify setup</li>
          <li>5. Use the app to get codes for future logins</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;