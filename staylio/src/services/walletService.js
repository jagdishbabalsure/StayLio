import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/wallet`;

const walletService = {
  getUserWallet: async (userId) => {
    return axios.get(`${API_URL}/user/${userId}`);
  }
};

export default walletService;
