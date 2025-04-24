// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.user.user);

  console.log("User object:", user); // Debugging line

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(`User role (${user.role}) not in allowed roles:`, allowedRoles); // Debugging line
    return <Navigate to="/not-allowed" replace />;
  }

  return children;
};
export default PrivateRoute;
