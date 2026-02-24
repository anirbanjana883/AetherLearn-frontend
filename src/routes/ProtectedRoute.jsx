import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, role }) {
  const { userData, isLoader } = useSelector((state) => state.user);

  if (isLoader) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!userData) return <Navigate to="/login" replace />;

  if (role && userData.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}