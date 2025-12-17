import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContent";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
