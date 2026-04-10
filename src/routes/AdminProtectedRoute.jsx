import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { token, role } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/" />;
  if (role !== "admin") return <Navigate to="/" />;

  return children;
};

export default AdminProtectedRoute;