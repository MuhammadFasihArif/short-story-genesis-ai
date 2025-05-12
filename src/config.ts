
// Environment configuration
const isDevelopment = import.meta.env.DEV || true;

// API configuration
export const API_URL = isDevelopment 
  ? "http://localhost:8000" // Local development Python backend
  : "https://your-production-api.com"; // Replace with production URL when deploying

