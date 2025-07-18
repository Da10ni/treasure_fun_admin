import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Deposits from "./pages/Deposits";
import Withdrawals from "./pages/Withdrawals";
import Users from "./pages/Users";
import Packages from "./pages/Products";
import Refferals from "./pages/Refferals";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./assets/protectedRoute/ProtectedRoute";
import Products from "./pages/Products";
import UpdateProfilePage from "./components/updateprofile/UpdateProfileForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="deposits"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Deposits />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="withdrawals"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Withdrawals />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            // <ProtectedRoute>
            //   <MainLayout>
            //     <Packages />
            //   </MainLayout>
            // </ProtectedRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />
        <Route
          path="referrals"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Refferals />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-profile/:id"
          element={
            <MainLayout>
              <UpdateProfilePage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
