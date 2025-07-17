import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        mobileNo: '',
        email: '',
        emailCode: '',
        referralCode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGetCode = () => {
        console.log('Get verification code');
    };

    const handleLogin = () => {
        console.log('Signup data:', formData);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className="py-5 flex items-center justify-center"
            >
                <h1 className="text-3xl font-bold">Login as Admin</h1>
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
                    />
                    <button
                        onClick={handleGetCode}
                        className="px-4 py-2.5 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 transition-colors text-sm font-medium"
                    >
                        Get
                    </button>
                </div>
            </div>

            {/* Sign Up Button */}
            <button
                onClick={handleLogin}
                className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md font-medium text-sm mb-4 cursor-not-allowed"
                disabled
            >
                Login
            </button>

            {/* Login Link */}
            <div className="text-center">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <Link to="/signup" className="text-cyan-400 hover:text-cyan-500 text-sm">Signup</Link>
            </div>
        </div>
    )
}

export default LoginForm
