
const FuturisticBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-purple-600/20 filter blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 rounded-full bg-cyan-400/20 filter blur-3xl animate-pulse-glow delay-700"></div>
        <div className="absolute top-[40%] right-[30%] w-32 h-32 rounded-full bg-purple-800/20 filter blur-2xl animate-pulse-glow delay-1000"></div>
      </div>
    </div>
  );
};

export default FuturisticBackground;
