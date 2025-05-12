
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FuturisticLoading from "@/components/FuturisticLoading";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FuturisticLoading />
      </div>
    );
  }

  // Allowing access whether authenticated or not
  return children;
};

export default ProtectedRoute;
