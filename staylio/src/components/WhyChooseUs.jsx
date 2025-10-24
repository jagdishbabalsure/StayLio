import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2"/>
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Best Price Guarantee',
      description: 'Find a lower price? We\'ll match it and give you an extra 10% off your next booking.'
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#34d399"/>
        </svg>
      ),
      title: 'Verified Stays',
      description: 'All our hotels are verified and reviewed by real guests for your peace of mind.'
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="2" fill="#fbbf24"/>
          <path d="M12 7v5l3 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="1.5" fill="white"/>
        </svg>
      ),
      title: '24/7 Support',
      description: 'Our dedicated support team is available around the clock to assist you.'
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="1"/>
        </svg>
      ),
      title: 'Instant Booking',
      description: 'Book instantly with immediate confirmation and no hidden fees.'
    }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Dark Background with Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury Hotel at Night"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/85"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-800/60 to-gray-900/70"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose Staylio?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're committed to making your travel experience seamless and memorable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group transform hover:-translate-y-2 transition-all duration-300"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slideUp 0.6s ease-out forwards'
              }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 border-2 border-gray-600 group-hover:border-gray-500">
                  {feature.icon}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10M+', label: 'Happy Customers' },
            { number: '50K+', label: 'Hotels Worldwide' },
            { number: '200+', label: 'Countries' },
            { number: '4.9', label: 'Average Rating' }
          ].map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl transform hover:scale-110 transition-all duration-300 hover:shadow-lg border border-gray-700"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;