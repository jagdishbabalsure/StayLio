import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturedHotels from './FeaturedHotels';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      <Navbar />
      <Hero />
      <FeaturedHotels />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;