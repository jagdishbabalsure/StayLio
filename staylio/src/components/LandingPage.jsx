import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AmbientBackground from './AmbientBackground';
import Hero from './Hero';
import WhyChooseUs from './WhyChooseUs';
import CitiesSection from './CitiesSection';
import Footer from './Footer';
import SphereGallery from './SphereGallery';
import hotelService from '../services/hotelService';

import HotelCard from './HotelCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [verifiedHotels, setVerifiedHotels] = useState([]);

  // Helper to get image URL safely
  const getHotelImage = (hotel) => {
    if (hotel.images && hotel.images.length > 0) {
      const primary = hotel.images.find(img => img.isPrimary);
      return primary ? primary.imageUrl : hotel.images[0].imageUrl;
    }
    if (hotel.allPhotoUrls) {
      // Handle comma-separated string from backend
      const urls = hotel.allPhotoUrls.split(',');
      return urls[0].trim();
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  };

  useEffect(() => {
    const fetchVerifiedHotels = async () => {
      try {
        const data = await hotelService.getLandingPageHotels();
        setVerifiedHotels(data);
      } catch (error) {
        console.error("Failed to fetch verified hotels", error);
      }
    };
    fetchVerifiedHotels();
  }, []);

  return (
    <div className="min-h-screen bg-[#060010] relative overflow-hidden">
      <AmbientBackground />
      {/* Scroll Progress Bar (Optional) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#8400ff] transform origin-left z-50"
        style={{ scaleX: 0 }} // Placeholder for scrollX if using useScroll
      />

      {/* Content Overlay */}
      <div className="relative z-10">

        {/* Animated Hero Wrapper */}
        <section className="relative">
          {/* Step 2: Hero Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#060010]/80 to-transparent pointer-events-none" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Hero />
          </motion.div>
        </section>

        {/* Why Choose Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <WhyChooseUs />
        </motion.div>

        {/* Top Verified Hotels Section with Sphere Gallery */}
        {verifiedHotels.length > 0 && (
          <section className="py-20 px-4 w-full relative overflow-hidden">
            {/* Step 4: Premium Background for Sphere */}
            <div className="absolute inset-0 bg-[#060010]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />

            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-glow">Top 7 Verified Stays</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Explore our premium selection of verified properties for your perfect getaway.</p>
            </div>

            <div className="h-[800px] w-full relative">
              <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <SphereGallery
                  images={verifiedHotels.slice(0, 7).map(hotel => ({
                    id: hotel.id,
                    src: getHotelImage(hotel),
                    alt: hotel.name
                  }))}
                />
              </div>
            </div>

            <div className="text-center mt-8 relative z-10">
              <button
                onClick={() => navigate('/hotels')}
                className="btn-primary text-lg px-8 py-3 rounded-full"
              >
                View All Hotels
              </button>
            </div>
          </section>
        )}

        {/* Cities Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <CitiesSection />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="py-32 relative overflow-hidden"
        >
          {/* Step 7: Animated Soft Gradient & Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-blue-900/5 to-purple-900/10 opacity-50 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8400ff]/20 rounded-full blur-[150px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <motion.h2
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-bold mb-8 text-white font-heading tracking-tight"
              >
                Ready to Start Your <br />
                <span>Journey?</span>
              </motion.h2>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
              >
                Join thousands of travelers who have found their perfect sanctuary with Staylio.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <button
                  onClick={() => navigate('/hotels')}
                  className="group relative px-8 py-4 bg-white/5 backdrop-blur-md rounded-full text-white font-semibold border border-white/10 overflow-hidden transition-all hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(132,0,255,0.3)]"
                >
                  <span className="relative z-10">Browse Collections</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8400ff] to-[#a855f7] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </button>

                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-[#8400ff] rounded-full text-white font-bold shadow-[0_0_20px_rgba(132,0,255,0.4)] hover:shadow-[0_0_40px_rgba(132,0,255,0.6)] hover:scale-105 transition-all duration-300"
                >
                  Sign Up Free
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;