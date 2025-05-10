
import { useNavigate } from "react-router-dom";
import GlowingButton from "@/components/GlowingButton";
import FuturisticBackground from "@/components/FuturisticBackground";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <FuturisticBackground />
      
      <div className="max-w-3xl w-full text-center z-10 relative animate-float">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-space text-gradient glow-text">
          AI Short Video Generator
        </h1>
        
        <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-xl mx-auto">
          Create stunning short-form videos with AI-powered visuals, narration, and captions in minutes.
          Perfect for social media and content creation.
        </p>
        
        <div className="flex justify-center">
          <GlowingButton onClick={() => navigate('/create')}>
            Get Started
          </GlowingButton>
        </div>
      </div>
      
      <div className="absolute bottom-8 flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Powered by advanced AI models
        </p>
        <div className="flex gap-6 items-center">
          <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
          <div className="w-6 h-6 bg-purple-600 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
