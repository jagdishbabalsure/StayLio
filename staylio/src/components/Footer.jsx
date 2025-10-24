import React from 'react';

const Footer = () => {
  const footerLinks = {
    Company: ['About Us', 'Careers', 'Press', 'Blog'],
    Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
    Destinations: ['Popular Cities', 'Top Hotels', 'Travel Guides', 'Special Offers'],
    Partners: ['Hotel Partners', 'Affiliate Program', 'Travel Agents', 'Corporate Travel']
  };

  const socialLinks = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
        </svg>
      ), 
      href: '#', 
      label: 'Facebook' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.017 0C18.624 0 20.5 1.796 20.5 8.5v3c0 6.704-1.876 8.5-8.483 8.5-6.607 0-8.483-1.796-8.483-8.5v-3C3.534 1.796 5.41 0 12.017 0zM8.5 6.5v7l5.5-3.5L8.5 6.5z" clipRule="evenodd" />
        </svg>
      ), 
      href: '#', 
      label: 'Instagram' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      ), 
      href: '#', 
      label: 'LinkedIn' 
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">Staylio</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for finding the perfect stay. We connect travelers 
                with amazing hotels and experiences worldwide, making every journey memorable.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 group">
                  <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300 hover:text-white transition-colors">hello@staylio.com</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300 hover:text-white transition-colors">8459946986</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300 hover:text-white transition-colors">Alandi,Pune</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div
              key={category}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <h4 className="text-lg font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`This would navigate to ${link}. In a real application, this would be a proper route.`);
                      }}
                      className="text-gray-300 hover:text-blue-400 transition-all duration-200 hover:translate-x-1 inline-block cursor-pointer"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 animate-slide-up">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="text-2xl font-bold mb-2">Stay Updated</h4>
              <p className="text-gray-300">
                Get the latest deals and travel tips delivered to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const emailInput = e.target.parentElement.querySelector('input[type="email"]');
                  const email = emailInput.value.trim();
                  
                  if (!email) {
                    alert('Please enter your email address');
                    return;
                  }
                  
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                  }
                  
                  alert('Thank you for subscribing! You will receive our latest deals and travel tips.');
                  emailInput.value = '';
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer btn-hover-effect"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2025 Staylio. All rights reserved.</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Additional Links */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('This would show the Privacy Policy. In a real application, this would be a proper page.');
                }}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('This would show the Terms of Service. In a real application, this would be a proper page.');
                }}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('This would show the Cookie Policy. In a real application, this would be a proper page.');
                }}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 transform hover:scale-110 hover:-translate-y-1 cursor-pointer"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;