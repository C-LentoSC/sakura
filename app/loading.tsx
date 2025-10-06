export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-pink-50/30 flex items-center justify-center relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Loading Content */}
      <div className="text-center relative z-10">
        {/* Sakura Brand with Icon */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            {/* Sakura Icon */}
            <div className="relative">
              <svg className="w-8 h-8 text-primary animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
              <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
            </div>
            
            {/* Brand Name */}
            <h1 className="text-4xl sm:text-5xl font-sakura text-primary">
              Sakura
            </h1>
          </div>
          
          {/* Elegant Underline */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/40"></div>
          </div>
        </div>

        {/* Enhanced Spinner */}
        <div className="mb-6">
          <div className="w-12 h-12 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 border-2 border-pink-100 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-2 border-transparent border-t-primary border-r-primary/50 rounded-full animate-spin"></div>
            {/* Inner glow */}
            <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse"></div>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Loading Text with Animation */}
        <div className="space-y-2">
          <p className="text-base text-gray-700 font-medium">
            Loading your experience
          </p>
        </div>
      </div>
    </div>
  );
}
