
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const MainNav = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="py-4 border-b border-muted relative z-10">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gradient">
            AI Shorts Generator
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/create" className="hover:text-primary transition-colors">
                  Create Video
                </Link>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm hidden sm:inline">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="secondary">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
