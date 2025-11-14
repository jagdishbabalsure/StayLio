import React, { useState } from 'react';
import { searchHotels } from '../data/hotels';

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    checkin: '',
    checkout: '',
    guests: '2'
  });

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Validate search data
    if (!searchData.location.trim()) {
      alert('Please enter a destination');
      return;
    }

    if (!searchData.checkin || !searchData.checkout) {
      alert('Please select check-in and check-out dates');
      return;
    }

    // Check if check-out is after check-in
    if (new Date(searchData.checkout) <= new Date(searchData.checkin)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    try {
      // Show search confirmation
      const searchSummary = `Searching for hotels in ${searchData.location}\nCheck-in: ${searchData.checkin}\nCheck-out: ${searchData.checkout}\nGuests: ${searchData.guests}`;
      alert(`Search initiated!\n\n${searchSummary}\n\nSearching available hotels...`);

      // Prepare search parameters for API
      const searchParams = {
        destination: searchData.location,
        checkIn: searchData.checkin,
        checkOut: searchData.checkout,
        guests: searchData.guests,
        city: searchData.location // API might expect city parameter
      };

      console.log('Search parameters:', searchParams);

      // Perform actual search via API
      const searchResults = await searchHotels(searchParams);
      console.log('Search results:', searchResults);

      // Store search results in localStorage for the hotels section to use
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
      localStorage.setItem('searchParams', JSON.stringify(searchData));

      // Scroll to featured hotels section to show results
      const featuredSection = document.getElementById('hotels');
      if (featuredSection) {
        const navbarHeight = 72;
        const targetPosition = featuredSection.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }

      // Trigger a custom event to notify the hotels section
      window.dispatchEvent(new CustomEvent('hotelSearchCompleted', { 
        detail: { results: searchResults, params: searchData } 
      }));

    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please check your connection and try again.');
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ transform: 'translateY(2px)' }}>
            Find Your Perfect Stay —{' '}
            <span className="text-yellow-400">Anytime, Anywhere</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Book hotels, resorts, and stays effortlessly with Staylio.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto animate-slide-up">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    name="location"
                    value={searchData.location}
                    onChange={handleInputChange}
                    placeholder="Where are you going?"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    name="checkin"
                    value={searchData.checkin}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    name="checkout"
                    value={searchData.checkout}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guests
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <select
                    name="guests"
                    value={searchData.guests}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5+">5+ Guests</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 cursor-pointer btn-hover-effect"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search Hotels</span>
              </button>
            </div>
          </form>
        </div>
      </div>


    </section>
  );
};

export default Hero;