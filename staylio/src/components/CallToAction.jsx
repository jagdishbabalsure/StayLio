import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Modern Luxury Hotel Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-slate-800/60 to-gray-900/70"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="mb-8 animate-fade-in">
            <div className="inline-block mb-6 animate-bounce-slow">
              <svg className="w-16 h-16 text-white mx-auto transform hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Plan Your Next Trip
              <br />
              <span className="text-yellow-400">With Staylio</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join millions of travelers who trust Staylio for their perfect getaway. 
              Start your journey today and discover amazing deals on hotels worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button 
              onClick={() => {
                const heroSection = document.getElementById('hero');
                if (heroSection) {
                  const navbarHeight = 72;
                  const targetPosition = heroSection.offsetTop - navbarHeight;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 group transform hover:-translate-y-1 hover:scale-105 cursor-pointer hover:bg-gray-50 btn-hover-effect"
            >
              <span>Start Booking</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
            <button 
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  const navbarHeight = 72;
                  const targetPosition = aboutSection.offsetTop - navbarHeight;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 cursor-pointer btn-hover-effect"
            >
              Learn More
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '2M+', label: 'Bookings This Year' },
              { number: '99.9%', label: 'Uptime Guarantee' },
              { number: '24/7', label: 'Customer Support' },
              { number: '4.9★', label: 'Customer Rating' }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-white transform hover:scale-110 transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeIn 0.6s ease-in-out forwards'
                }}
              >
                <div className="text-2xl md:text-3xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce-slow"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl" style={{
        animation: 'bounce 3s infinite 1s'
      }}></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/5 rounded-full blur-xl" style={{
        animation: 'bounce 5s infinite 2s'
      }}></div>
    </section>
  );
};

export default CallToAction;