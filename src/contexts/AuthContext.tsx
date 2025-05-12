
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in via localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("demo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Listen for navigation events to simulate auth
  useEffect(() => {
    // This would normally be listening to auth state changes
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      
      // If user just returned from a simulated login flow at /auth
      if (currentPath === "/create" && !user) {
        const demoUser = { 
          id: "demo-" + Math.random().toString(36).substr(2, 9),
          email: "demo@example.com" 
        };
        setUser(demoUser);
        localStorage.setItem("demo_user", JSON.stringify(demoUser));
      }
    };

    handleRouteChange();
    
    // For a real app, we'd use a proper router event listener
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [user]);

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("demo_user");
  };

  const value = {
    user,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
