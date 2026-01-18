const axios = require('axios');

const fetchNewsFromAPI = async (category) => {
  const API_KEY = process.env.NEWSDATA_API_KEY;
  
  // Base URL with size set to 50 for max results
  let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=en&size=10`;

  // If the user wants a specific category (not 'all' or 'top'), append it to the URL
  if (category && category !== 'all' && category !== 'top') {
    url += `&category=${category}`;
  }

  try {
    const response = await axios.get(url);
    // NewsData.io returns an array called 'results'
    return response.data.results || []; 
  } catch (error) {
    console.error(`API Fetch Error:`, error.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchNewsFromAPI };