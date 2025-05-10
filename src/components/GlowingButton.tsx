
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlowingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
}

const GlowingButton = ({ children, onClick, isLoading = false, className = "" }: GlowingButtonProps) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      <Button 
        className={`relative px-8 py-6 bg-background text-white border-0 font-space text-lg flex items-center gap-3 hover:bg-secondary transition-all duration-500 ${className}`} 
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <>
            {children}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </div>
  );
};

export default GlowingButton;
