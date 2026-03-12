// API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5001'
  },
  production: {
    API_BASE_URL: 'https://your-backend-url.railway.app' // Update this with your deployed backend URL
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = config[environment].API_BASE_URL;

console.log(`Running in ${environment} mode with API: ${API_BASE_URL}`);