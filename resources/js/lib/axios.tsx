// resources/js/lib/axios.ts - Corrected for Laravel 12
import axios from 'axios';

// Create a reusable Axios instance with default settings for your app
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://taskly-d79v.onrender.com',  // Base URL for all API requests
    withCredentials: true,         // Required for SPA authentication (cookies/session)
    headers: {
        'X-Requested-With': 'XMLHttpRequest', // Tells Laravel it's an AJAX request
        Accept: 'application/json',           // Ensure responses are JSON
    },
});

// Configure defaults specific to this Axios instance
instance.defaults.withCredentials = true; // Makes sure credentials are always sent
instance.defaults.withXSRFToken = true;   // Laravel 12 feature: handles CSRF tokens automatically

// Helper function to fetch CSRF cookie before making requests that require it
export const csrf = () => instance.get('/sanctum/csrf-cookie');

// Export the configured Axios instance for use across the app
export default instance;
