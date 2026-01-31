import React from 'react';
import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel, showPrice = true }) => {
    const navigate = useNavigate();

    const getPrimaryImage = (hotel) => {
        if (hotel.images && hotel.images.length > 0) {
            const primary = hotel.images.find(img => img.isPrimary);
            return primary ? primary.imageUrl : hotel.images[0].imageUrl;
        }
        if (hotel.allPhotoUrls) {
            const urls = hotel.allPhotoUrls.split(',');
            return urls[0].trim();
        }
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
    };

    return (
        <div
            className="group relative bg-[#ffffff]/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-2"
            onClick={() => navigate(`/hotels/${hotel.id}`)}
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={getPrimaryImage(hotel)}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060010]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold text-white border border-white/20 flex items-center gap-1.5">
                    <span className="text-yellow-400">★</span>
                    {hotel.rating || 'New'}
                </div>

                {!hotel.hotelOwnerId && (
                    <div className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-red-400/30">
                        Unclaimed
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white font-heading tracking-wide group-hover:text-[#a855f7] transition-colors line-clamp-1">{hotel.name}</h3>
                </div>

                <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#8400ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {hotel.city}, {hotel.country}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    {showPrice && (
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Starts from</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">₹{hotel.pricePerNight}</span>
                                <span className="text-xs text-gray-500">/night</span>
                            </div>
                        </div>
                    )}
                    <button className="px-5 py-2.5 bg-white/10 hover:bg-[#8400ff] text-white rounded-xl text-sm font-semibold transition-all duration-300 border border-white/10 hover:border-[#8400ff] backdrop-blur-sm group-hover:shadow-[0_0_15px_rgba(132,0,255,0.4)]">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
