import { Navigate } from "react-router-dom";
import { getTokenFromCookie } from "../../services/auth";

const ProtectedRoute = ({ children }) => {
  const token = getTokenFromCookie();

  if (token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;