import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    //replace ma3naha eno mshh hy2dr yrg3 llpage ely kan feha bel back button
    //b3d ma yt3ml redirect
    return <Navigate to="/login" replace />;
  }
  //lw el user mwgod e3rd el page ely gwa el protectedRoute
  return children;
}

export default ProtectedRoute;
