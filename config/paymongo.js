const axios = require('axios');

// PayMongo API base URL
const PAYMONGO_API_URL = 'https://api.paymongo.com/v1';

// Create base64 encoded authorization header
const getAuthHeader = () => {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  const encodedKey = Buffer.from(secretKey + ':').toString('base64');
  return `Basic ${encodedKey}`;
};

// PayMongo API client
const paymongoClient = axios.create({
  baseURL: PAYMONGO_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth header to each request
paymongoClient.interceptors.request.use((config) => {
  config.headers.Authorization = getAuthHeader();
  return config;
});

module.exports = paymongoClient;
