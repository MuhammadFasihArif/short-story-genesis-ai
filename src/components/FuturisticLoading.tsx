
import React from "react";

interface LoadingProps {
  message?: string;
}

const FuturisticLoading: React.FC<LoadingProps> = ({ message = "Generating Your Video..." }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-8 p-8">
      <div className="relative">
        <div className="loader"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-background rounded-full"></div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-space font-medium text-gradient mb-2">{message}</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Creating captivating visuals and audio for your story. This might take a few minutes.
        </p>
      </div>
    </div>
  );
};

export default FuturisticLoading;
