import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/chatbot`;

export const sendChatQuery = async (message, userId) => {
  try {
    const response = await axios.post(`${API_URL}/query`, {
      message,
      userId
    });
    return response.data;
  } catch (error) {
    console.error("Error sending query:", error);
    throw error;
  }
};
