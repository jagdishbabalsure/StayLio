import hotelService from '../services/hotelService.js';

// Export async function to get featured hotels from API
export const getFeaturedHotels = async () => {
  try {
    return await hotelService.getFeaturedHotels();
  } catch (error) {
    console.error('Error loading featured hotels:', error);
    return [];
  }
};

// Export async function to get all hotels from API
export const getAllHotels = async () => {
  try {
    return await hotelService.getAllHotels();
  } catch (error) {
    console.error('Error loading all hotels:', error);
    return [];
  }
};

// Export async function to search hotels
export const searchHotels = async (searchParams) => {
  try {
    return await hotelService.searchHotels(searchParams);
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
};

// For backward compatibility, export empty array initially
// Components will load data asynchronously
export const featuredHotels = [];

export const testimonials = [
  {
    id: 1,
    name: "Nikita Patil",
    avatar: "https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    review: "Staylio made booking my vacation so easy! The interface is intuitive and I found the perfect hotel at an amazing price. The customer service was exceptional."
  },
  {
    id: 2,
    name: "Uday Sapate",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    review: "Best hotel booking platform I've used. Great customer service and instant confirmation. The price guarantee feature saved me hundreds of dollars!"
  },
  {
    id: 3,
    name: "Abhay Maurya",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    review: "I've saved so much money using Staylio. The price guarantee feature is fantastic and the booking process is seamless. Highly recommended for all travelers!"
  }
];