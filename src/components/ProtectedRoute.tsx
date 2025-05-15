
import { useAuth } from "@/contexts/AuthContext";
import FuturisticLoading from "@/components/FuturisticLoading";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FuturisticLoading />
      </div>
    );
  }

  // Frontend-only demo, just show the children component
  return children;
};

export default ProtectedRoute;
