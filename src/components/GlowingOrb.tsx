
const GlowingOrb = () => {
  return (
    <div className="absolute pointer-events-none">
      <div className="w-64 h-64 rounded-full bg-purple-600/20 filter blur-3xl animate-pulse-glow"></div>
    </div>
  );
};

export default GlowingOrb;
