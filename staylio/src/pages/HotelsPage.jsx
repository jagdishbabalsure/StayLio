import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';

const HotelsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [hotelToBook, setHotelToBook] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sortBy, setSortBy] = useState('name');

  const handleBooking = (hotel, e) => {
    e.stopPropagation(); // Prevent modal from opening
    
    if (!isAuthenticated) {
      // Show login prompt
      const shouldLogin = window.confirm(
        `🔐 Login Required\n\n` +
        `You need to be logged in to make a booking.\n\n` +
        `Would you like to go to the login page?`
      );
      
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }

    // User is authenticated, open booking modal
    setHotelToBook(hotel);
    setIsBookingModalOpen(true);
    setIsModalOpen(false); // Close hotel details modal if open
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
    setHotelToBook(null);
  };

  const openModal = (hotel) => {
    setSelectedHotel(hotel);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedHotel && selectedHotel.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedHotel.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedHotel && selectedHotel.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedHotel.images.length - 1 : prev - 1
      );
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredHotels(hotels);
      return;
    }

    const filtered = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(query.toLowerCase()) ||
      hotel.city.toLowerCase().includes(query.toLowerCase()) ||
      (hotel.description && hotel.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredHotels(filtered);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredHotels].sort((a, b) => {
      switch (sortType) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    setFilteredHotels(sorted);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API, fallback to mock data
        try {
          const response = await fetch('http://localhost:8081/api/hotels');
          if (response.ok) {
            const data = await response.json();
            // Enhance data with additional properties for better UX
            const enhancedData = data.map(hotel => ({
              ...hotel,
              images: hotel.images || [
                hotel.image,
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ],
              amenities: hotel.amenities || ['Free WiFi', 'Swimming Pool', 'Gym', 'Restaurant', 'Room Service', 'Parking'],
              description: hotel.description || `Experience luxury and comfort at ${hotel.name}. Located in the heart of ${hotel.city}, this premium hotel offers world-class amenities and exceptional service to make your stay unforgettable.`,
              contact: hotel.contact || '+91 98765 43210'
            }));
            setHotels(enhancedData);
            setFilteredHotels(enhancedData);
          } else {
            throw new Error('API not available');
          }
        } catch (apiError) {
          // Fallback to mock data
          const mockHotels = [
            {
              id: 1,
              name: 'Grand Palace Hotel',
              city: 'Mumbai',
              price: 8500,
              rating: 4.8,
              reviews: 1250,
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              images: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ],
              amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Room Service', 'Valet Parking', 'Business Center'],
              description: 'Experience luxury redefined at Grand Palace Hotel. Located in the heart of Mumbai, this 5-star property offers breathtaking city views, world-class amenities, and impeccable service.',
              contact: '+91 98765 43210'
            },
            {
              id: 2,
              name: 'Seaside Resort',
              city: 'Goa',
              price: 6200,
              rating: 4.6,
              reviews: 890,
              image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              images: [
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ],
              amenities: ['Beach Access', 'Free WiFi', 'Swimming Pool', 'Water Sports', 'Restaurant', 'Bar', 'Spa'],
              description: 'Wake up to the sound of waves at Seaside Resort. This beachfront paradise in Goa offers the perfect blend of relaxation and adventure with direct beach access.',
              contact: '+91 98765 43211'
            },
            {
              id: 3,
              name: 'Mountain View Lodge',
              city: 'Shimla',
              price: 4800,
              rating: 4.4,
              reviews: 650,
              image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              images: [
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ],
              amenities: ['Mountain Views', 'Free WiFi', 'Fireplace', 'Restaurant', 'Trekking Guide', 'Parking'],
              description: 'Escape to the serene mountains at Mountain View Lodge. Nestled in the hills of Shimla, enjoy panoramic views and fresh mountain air in this cozy retreat.',
              contact: '+91 98765 43212'
            },
            {
              id: 4,
              name: 'City Center Hotel',
              city: 'Delhi',
              price: 7200,
              rating: 4.5,
              reviews: 1100,
              image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              images: [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ],
              amenities: ['Free WiFi', 'Business Center', 'Gym', 'Restaurant', 'Conference Rooms', 'Airport Shuttle'],
              description: 'Stay in the heart of the capital at City Center Hotel. Perfect for business and leisure travelers, with easy access to major attractions and business districts.',
              contact: '+91 98765 43213'
            },
            {
              id: 5,
              name: 'Heritage Palace',
              city: 'Jaipur',
              price: 9500,
              rating: 4.9,
              reviews: 780,
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              images: [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ],
              amenities: ['Royal Architecture', 'Free WiFi', 'Traditional Spa', 'Multi-cuisine Restaurant', 'Cultural Shows', 'Elephant Rides'],
              description: 'Step into royalty at Heritage Palace. This magnificent property in Jaipur offers an authentic royal experience with traditional Rajasthani architecture and hospitality.',
              contact: '+91 98765 43214'
            },
            {
              id: 6,
              name: 'Tech Hub Hotel',
              city: 'Bangalore',
              price: 5800,
              rating: 4.3,
              reviews: 920,
              image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              images: [
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ],
              amenities: ['High-Speed WiFi', 'Co-working Space', 'Gym', 'Restaurant', 'Tech Support', 'Meeting Rooms'],
              description: 'Perfect for the modern traveler, Tech Hub Hotel in Bangalore combines comfort with connectivity. Ideal for business travelers and tech professionals.',
              contact: '+91 98765 43215'
            }
          ];
          setHotels(mockHotels);
          setFilteredHotels(mockHotels);
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Loading hotels...</h2>
              <p className="text-lg text-gray-600 mb-2">Please wait while we fetch the latest hotel information</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Failed to fetch hotels</h2>
              <p className="text-lg text-gray-600 mb-2">{error}</p>
              <p className="text-gray-500 mb-8">Please ensure the API server is running on http://localhost:8081</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 font-semibold shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section with Search */}
      <div className="pt-24 pb-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Find Your Perfect Stay
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover {hotels.length} amazing hotels across India
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by hotel name or city..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
              {filteredHotels.length} {filteredHotels.length === 1 ? 'property' : 'properties'}
            </span>
            {searchQuery && (
              <span className="text-sm text-gray-500">
                for "{searchQuery}"
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredHotels.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : 'No properties available at the moment.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 cursor-pointer group"
                onClick={() => openModal(hotel)}
              >
                {/* Hotel Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-md px-2 py-1 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm font-semibold text-gray-800">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{hotel.city}</span>
                  </div>

                  {/* Amenities Preview */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{hotel.amenities.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        ₹{hotel.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {hotel.reviews.toLocaleString()} reviews
                      </div>
                      <div className="flex items-center justify-end mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={(e) => handleBooking(hotel, e)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                      isAuthenticated 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {isAuthenticated ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1M8 7h8m-9 4v8a2 2 0 002 2h8a2 2 0 002-2v-8M9 11h6" />
                        </svg>
                        <span>Book Now</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Login to Book</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Modal */}
      {isModalOpen && selectedHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-lg">
              {/* Modal Header */}
              <div className="relative">
                {/* Image Carousel */}
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img
                    src={selectedHotel.images[currentImageIndex]}
                    alt={selectedHotel.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows */}
                  {selectedHotel.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-2 shadow-md transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-2 shadow-md transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image indicators */}
                  {selectedHotel.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {selectedHotel.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-2 shadow-md transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Hotel Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedHotel.name}</h2>
                        <div className="flex items-center text-gray-600 mb-2">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{selectedHotel.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-md border">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-semibold text-gray-800">{selectedHotel.rating}</span>
                        <span className="text-gray-600 ml-1 text-sm">({selectedHotel.reviews.toLocaleString()})</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{selectedHotel.description}</p>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What this place offers</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedHotel.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <svg className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">{selectedHotel.contact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Booking */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          ₹{selectedHotel.price.toLocaleString()}
                        </div>
                        <div className="text-gray-600 text-sm">per night</div>
                      </div>

                      <button
                        onClick={(e) => handleBooking(selectedHotel, e)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors duration-200 mb-3"
                      >
                        Reserve
                      </button>

                      <div className="text-center text-xs text-gray-500 mb-3">
                        You won't be charged yet
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>₹{selectedHotel.price.toLocaleString()} × 1 night</span>
                          <span>₹{selectedHotel.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Service fee</span>
                          <span>₹0</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>₹{selectedHotel.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        hotel={hotelToBook}
      />
    </div>
  );
};

export default HotelsPage;