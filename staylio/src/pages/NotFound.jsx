import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);

    // Generate floating elements
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 5,
      size: Math.random() * 10 + 5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-float"
            style={{
              left: `${element.left}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.animationDelay}s`,
              opacity: element.opacity,
            }}
          />
        ))}
      </div>

      {/* Geometric Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-indigo-200/30 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-32 w-20 h-20 bg-pink-200/30 rotate-12 animate-pulse"></div>

      <Navbar />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        <div className={`text-center transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Animated 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-x leading-none">
              404
            </h1>
            
            {/* Glowing Effect */}
            <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-blue-600/20 animate-pulse blur-sm">
              404
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🏨</div>
            <div className="absolute -top-2 -right-8 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>✈️</div>
            <div className="absolute -bottom-4 left-8 text-2xl animate-bounce" style={{animationDelay: '1s'}}>🗺️</div>
          </div>

          {/* Main Message */}
          <div className={`mb-8 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
              Oops! Page Not Found
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-2 animate-fade-in-delay">
              Looks like you've wandered off the beaten path
            </p>
            <p className="text-lg text-gray-500 animate-fade-in-delay-2">
              The page you're looking for doesn't exist or has been moved
            </p>
          </div>

          {/* Animated Search Suggestion */}
          <div className={`mb-12 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <p className="text-gray-700 font-medium">
                🔍 Maybe you were looking for:
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Home page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🏨</span>
                  <span>Hotels listing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Link
              to="/"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2 animate-button-glow"
            >
              <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go Home</span>
            </Link>

            <Link
              to="/hotels"
              className="group bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Browse Hotels</span>
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="group bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </button>
          </div>

          {/* Fun Message */}
          <div className={`mt-12 transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-gray-500 text-sm animate-pulse">
              Don't worry, even the best travelers sometimes take a wrong turn! 🧭
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          0% { opacity: 0; transform: translateY(20px); }
          60% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay-2 {
          0% { opacity: 0; transform: translateY(20px); }
          80% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes button-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.4); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 2s ease-out;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 2.5s ease-out;
        }
        
        .animate-button-glow {
          animation: button-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;