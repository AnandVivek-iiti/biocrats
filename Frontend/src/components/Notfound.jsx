import { useState, useEffect } from 'react';
import { Home, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 overflow-hidden relative flex items-center justify-center">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Astronaut SVG */}
        <div
          className="w-40 h-40 mx-auto mb-8 transition-transform duration-300"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) rotate(${mousePosition.x}deg)`
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            {/* Helmet */}
            <circle cx="100" cy="80" r="40" fill="white" opacity="0.95" />
            <circle cx="100" cy="80" r="35" fill="rgba(139, 92, 246, 0.1)" />

            {/* Visor reflection */}
            <ellipse cx="95" cy="75" rx="15" ry="12" fill="rgba(139, 92, 246, 0.3)" />

            {/* Eyes */}
            <circle cx="90" cy="75" r="4" fill="#4F46E5" />
            <circle cx="110" cy="75" r="4" fill="#4F46E5" />

            {/* Smile */}
            <path d="M 85 88 Q 100 93 115 88" stroke="#4F46E5" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Body */}
            <rect x="70" y="120" width="60" height="50" rx="8" fill="white" opacity="0.95" />

            {/* Chest emblem */}
            <circle cx="100" cy="140" r="10" fill="#4F46E5" opacity="0.8" />
            <circle cx="100" cy="140" r="6" fill="white" opacity="0.5" />

            {/* Arms */}
            <rect x="55" y="125" width="18" height="45" rx="9" fill="white" opacity="0.95" />
            <rect x="127" y="125" width="18" height="45" rx="9" fill="white" opacity="0.95" />

            {/* Legs */}
            <rect x="75" y="165" width="20" height="30" rx="5" fill="white" opacity="0.95" />
            <rect x="105" y="165" width="20" height="30" rx="5" fill="white" opacity="0.95" />

            {/* Boots */}
            <ellipse cx="85" cy="195" rx="12" ry="6" fill="#4F46E5" />
            <ellipse cx="115" cy="195" rx="12" ry="6" fill="#4F46E5" />
          </svg>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-black text-white mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
          404
        </h1>

        {/* Title */}
        <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
         Oops, We Have a Problem
        </h2>

        {/* Description */}
        <p className="text-xl text-purple-100 mb-8 animate-fade-in-delay">
          The page you're looking for is not available.
          Let's navigate you back to safety.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
          <button
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Return Home
          </button>

          <button
            onClick={() => window.location.reload()}
            className="group flex items-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-400/50 transform hover:-translate-y-1 transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out 0.3s both;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.6s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.9s both;
        }
      `}</style>
    </div>
  );
}