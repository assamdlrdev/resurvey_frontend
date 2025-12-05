const Constants: any = {
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:5173/resurvey/', // Fallback for local development
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Resurvey', // Fallback for local development
  COVER: import.meta.env.VITE_COVER || 'cover.jpg', // Fallback for local development
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/chithaapi_gitlab/index.php/', // Fallback for local development
  API_BASE_URL_ASSET: import.meta.env.VITE_API_BASE_URL_ASSET || 'http://localhost/chithaapi_gitlab/', // Fallback for local development
  API_SECRET: import.meta.env.VITE_API_SECRET || 'CHITHARESURVEY12345678', // Fallback for local development
  SERVICE_PERCENTAGE: import.meta.env.VITE_SERVICE_PERCENTAGE ? parseFloat(import.meta.env.VITE_SERVICE_PERCENTAGE) : 5, // Default 5% if not set
  SINGLESIGN_URL: import.meta.env.VITE_SINGLESIGN_URL || 'http://localhost/singlesignResurvey/', // Fallback for local development
};

export default Constants;
