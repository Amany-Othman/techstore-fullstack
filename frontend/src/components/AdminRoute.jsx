import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Not logged in at all -> send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin -> send home
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
