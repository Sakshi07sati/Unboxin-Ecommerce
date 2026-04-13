import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PermissionProtectedRoute = ({ children, module, action }) => {
  const { token, permissions } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/" />;

  const hasPermission = permissions?.[module]?.includes(action);//module- products, action- read, write, delete

  return hasPermission ? children : <Navigate to="/" />;
};

export default PermissionProtectedRoute;