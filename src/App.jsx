import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Deposits from "./pages/Deposits";
import Withdrawals from "./pages/Withdrawals";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Refferals from "./pages/Refferals";
import LoginPage from "./pages/LoginPage";
// import Notification from './pages/Notification'
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute"; // This should be AdminProtectedRoute
import UpdateProfilePage from "./components/updateprofile/UpdateProfileForm";
import HeroImage from "./pages/HeroImage";
import Notification from "./pages/Notification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =============================================
            ADMIN AUTHENTICATION ROUTES
            ============================================= */}

        {/* Admin Login - Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* =============================================
            ADMIN PROTECTED ROUTES
            All routes below require ADMIN authentication
            ============================================= */}

        {/* Admin Dashboard - Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* =============================================
            DEPOSIT MANAGEMENT (Admin)
            ============================================= */}
        <Route
          path="/deposits"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Deposits />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* =============================================
            WITHDRAWAL MANAGEMENT (Admin)
            ============================================= */}
        <Route
          path="/withdrawals"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Withdrawals />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* =============================================
            USER MANAGEMENT (Admin)
            ============================================= */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* =============================================
            PRODUCT MANAGEMENT (Admin)
            ============================================= */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Products />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* =============================================
            REFERRAL MANAGEMENT (Admin)
            ============================================= */}
        {/* <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Refferals />
              </MainLayout>
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/Notification"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notification />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* =============================================
            HERO IMAGE (Admin)
            ============================================= */}
        <Route
          path="/images"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HeroImage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* =============================================
            ADMIN PROFILE MANAGEMENT
            ============================================= */}
        {/* <Route
          path="/update-profile/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* =============================================
            ADMIN ADDITIONAL ROUTES (Optional)
            ============================================= */}

        {/* Admin Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Admin Settings</h1>
                  <p>System configuration and admin preferences</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Admin Reports</h1>
                  <p>Analytics and system reports</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* =============================================
            ERROR HANDLING
            ============================================= */}

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center bg-white p-8 rounded-lg shadow-md">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Admin Panel
                </h1>
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                  404 - Page Not Found
                </h2>
                <p className="text-gray-600 mb-6">
                  The requested admin page does not exist.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Go to Admin Dashboard
                  </button>
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Admin Login
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
