'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function CherryBlossomTrees() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Left Side Cherry Blossom Tree - Top */}
      <div className={`fixed left-0 top-20 bottom-0 pointer-events-none z-0 transition-all duration-1000 ease-out ${
        isVisible ? 'translate-x-0 opacity-60 sm:opacity-70 lg:opacity-80' : '-translate-x-full opacity-0'
      }`}>
        <div className="animate-sway-gentle">
          <Image
            src="/sakura-saloon-images/L-tree.png"
            alt="Left Cherry Blossom Tree"
            width={1920}
            height={1000}
            priority
            className="h-36 sm:h-40 sm:w-40 lg:h-50 lg:w-100 object-cover transition-transform duration-3000 hover:scale-105"
          />
        </div>
      </div>

      {/* Left Side Cherry Blossom Tree - Bottom */}
      <div className={`fixed left-0 bottom-0 pointer-events-none z-0 transition-all duration-1200 delay-200 ease-out ${
        isVisible ? 'translate-y-0 opacity-60 sm:opacity-70 lg:opacity-80' : 'translate-y-full opacity-0'
      }`}>
        <div className="animate-sway-slow">
          <Image
            src="/sakura-saloon-images/L4-tree.png"
            alt="Left Cherry Blossom Tree"
            width={1920}
            height={1000}
            className="h-40 w-full sm:h-60 lg:h-120 object-cover transition-transform duration-3000 hover:scale-105"
          />
        </div>
      </div>

      {/* Right Side Cherry Blossom Tree */}
      <div className={`fixed right-0 top-80 pointer-events-none z-0 transition-all duration-1000 delay-400 ease-out ${
        isVisible ? 'translate-x-0 opacity-50 sm:opacity-55 lg:opacity-60' : 'translate-x-full opacity-0'
      }`}>
        <div className="animate-sway-gentle-reverse">
          <Image
            src="/sakura-saloon-images/R2-tree.png"
            alt="Right Cherry Blossom Tree"
            width={1920}
            height={1024}
            className="h-24 w-40 sm:h-60 sm:w-80 lg:h-95 lg:w-164 object-cover transition-transform duration-3000 hover:scale-105"
          />
        </div>
      </div>

      {/* Floating Sakura Petals */}
      <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
        {[...Array(12)].map((_, i) => {
          // Use deterministic values based on index to avoid hydration mismatch
          const positions = [
            { left: 15, top: 20 },
            { left: 85, top: 30 },
            { left: 25, top: 60 },
            { left: 75, top: 80 },
            { left: 45, top: 15 },
            { left: 65, top: 45 },
            { left: 35, top: 75 },
            { left: 55, top: 25 },
            { left: 10, top: 50 },
            { left: 90, top: 65 },
            { left: 50, top: 85 },
            { left: 70, top: 10 }
          ];
          
          const durations = [8, 9, 10, 11, 12, 8.5, 9.5, 10.5, 11.5, 8.2, 9.8, 10.2];
          const delays = [0, 1, 2, 3, 4, 0.5, 1.5, 2.5, 3.5, 4.5, 0.8, 2.8];
          
          return (
            <div
              key={i}
              className={`absolute animate-float-petal opacity-30 transition-opacity duration-1000 ${
                isVisible ? 'opacity-30' : 'opacity-0'
              }`}
              style={{
                left: `${positions[i].left}%`,
                top: `${positions[i].top}%`,
                animationDelay: `${delays[i]}s`,
                animationDuration: `${durations[i]}s`
              }}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
            </div>
          );
        })}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes sway-gentle {
          0%, 100% { transform: rotate(0deg) translateX(0px); }
          25% { transform: rotate(0.5deg) translateX(2px); }
          75% { transform: rotate(-0.5deg) translateX(-2px); }
        }
        
        @keyframes sway-slow {
          0%, 100% { transform: rotate(0deg) translateY(0px); }
          50% { transform: rotate(0.3deg) translateY(1px); }
        }
        
        @keyframes sway-gentle-reverse {
          0%, 100% { transform: rotate(0deg) translateX(0px); }
          25% { transform: rotate(-0.5deg) translateX(-2px); }
          75% { transform: rotate(0.5deg) translateX(2px); }
        }
        
        @keyframes float-petal {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateY(-30px) rotate(270deg); opacity: 0.5; }
          100% { transform: translateY(-40px) rotate(360deg); opacity: 0.2; }
        }
        
        .animate-sway-gentle {
          animation: sway-gentle 6s ease-in-out infinite;
        }
        
        .animate-sway-slow {
          animation: sway-slow 8s ease-in-out infinite;
        }
        
        .animate-sway-gentle-reverse {
          animation: sway-gentle-reverse 7s ease-in-out infinite;
        }
        
        .animate-float-petal {
          animation: float-petal 12s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
