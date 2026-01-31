import { useNavigate } from 'react-router-dom';

const CitiesSection = () => {
  const navigate = useNavigate();

  const cities = [
    {
      name: 'Mumbai',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
      hotels: '500+',
      description: 'The City of Dreams',
      gradient: 'from-orange-600/90 to-red-600/90',
    },
    {
      name: 'Pune',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1707617645764-08862c06fd7f?q=80&w=1211&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      hotels: '350+',
      description: 'Oxford of the East',
      gradient: 'from-purple-600/90 to-pink-600/90',
    },
    {
      name: 'Nagpur',
      country: 'India',
      image: 'https://www.luxurytrailsofindia.com/wp-content/uploads/2016/12/nagpurmaharashtraindia-1.jpg',
      hotels: '150+',
      description: 'Orange City',
      gradient: 'from-orange-500/90 to-yellow-500/90',
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background World Map Vector or Abstract shape */}
      <div className="absolute inset-0 bg-[#060010]" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060010] via-transparent to-[#060010]" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-modern inline-block">
            Explore Top Cities
          </h2>
          <p className="text-xl text-[#B8C4E6] max-w-2xl mx-auto font-light">
            Discover the most sought-after destinations with premium accommodations
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cities.map((city, index) => (
            <div
              key={index}
              onClick={() => navigate(`/hotels?city=${encodeURIComponent(city.name)}`)}
              className="group relative h-[28rem] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >
              {/* Image */}
              <div className="absolute inset-0 bg-gray-900">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                />
              </div>

              {/* Gradient Overlay - Strong contrast for text visibility */}
              <div className={`absolute inset-0 bg-gradient-to-t ${city.gradient} opacity-50 group-hover:opacity-60 transition-opacity duration-500`}></div>

              {/* Additional dark overlay at bottom for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">

                  {/* City Name */}
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 font-heading">
                    {city.name}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-gray-200 mb-6 font-light">
                    {city.description}
                  </p>

                  {/* Explore Button */}
                  <div className="flex items-center gap-2 text-white font-semibold group/btn">
                    <span className="text-lg group-hover/btn:text-purple-300 transition-colors">Explore Properties</span>
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/hotels')}
            className="group px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-lg text-white font-medium"
          >
            <span className="flex items-center gap-3">
              View All Destinations
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
