

export const Quote = ({ type }: { type: "signup" | "signin" }) => {
  return (
    <div className="h-screen flex flex-col justify-between bg-gray-900 p-12 lg:p-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#3b82f6,_transparent_40%)]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] opacity-20 bg-[radial-gradient(circle_at_center,_#60a5fa,_transparent_50%)] blur-3xl" />
      
      <div className="relative z-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">101dev</h1>
        <p className="text-gray-400 text-sm font-medium">The Editorial Platform</p>
      </div>
      
      <div className="relative z-10 max-w-xl">
        <div className="text-4xl text-blue-500 mb-6 opacity-80">"</div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-8">
          {type === "signup"
            ? "A community of thinkers, writers, and dreamers. Join us in shaping the future of technical writing."
            : "Welcome back. Let's create something amazing today and inspire the world."}
        </h2>
        <div className="space-y-1">
          <h5 className="text-lg font-semibold tracking-tight text-white">Ch Mahesh</h5>
          <p className="text-sm text-gray-300 font-medium">Founder, 101dev</p>
        </div>
      </div>
    </div>
  );
};
