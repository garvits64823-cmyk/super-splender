// API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5002'
  },
  production: {
    API_BASE_URL: 'https://super-splender-backend-4s7s.onrender.com'
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = config[environment].API_BASE_URL;

console.log(`Running in ${environment} mode with API: ${API_BASE_URL}`);