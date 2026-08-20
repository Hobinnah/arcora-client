
{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */ }

// Alert type for consistent typing across the app
export type AlertType = 'success' | 'error' | 'info';

const devApiTarget = import.meta.env.VITE_API_BASE_URL_DEV || '';
const prodApiTarget = import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL || 'https://productionUrl/';
const apiTargetUrl = import.meta.env.DEV ? devApiTarget : prodApiTarget;

export const env = {
    // Environment mode from Vite
    NODE_ENV: import.meta.env.MODE,

    // Authentication setting from .env file
    USE_AUTH: import.meta.env.VITE_USE_AUTH === 'true',

    // Authentication cookie name and security settings
    AUTH_COOKIE_NAME: import.meta.env.VITE_AUTH_COOKIE_NAME || 'auth_session_intentraai',
    COOKIE_SECURE: import.meta.env.VITE_COOKIE_SECURE === 'true',

    // Keep proxy path in development, use full target URL in production
    API_BASE_URL: import.meta.env.DEV ? '/' : (apiTargetUrl || ''),

    // API target URL switches based on environment mode
    API_TARGET_URL: apiTargetUrl,

    // Search strategy from .env file with fallback
    SEARCH_STRATEGY: (import.meta.env.VITE_SEARCH_STRATEGY as 'server' | 'client') || 'client',

    // Alert duration settings from .env file with fallbacks
    ALERT_DURATIONS: {
        'success': parseInt(import.meta.env.VITE_ALERT_DURATION_SUCCESS) || 5000,
        'info': parseInt(import.meta.env.VITE_ALERT_DURATION_INFO) || 6000,
        'error': parseInt(import.meta.env.VITE_ALERT_DURATION_ERROR) || 10000
    },

    // Delimiter for 2FA token encoding/decoding from .env file
    TOKEN_2FA_DELIMITER: import.meta.env.VITE_TOKEN_2FA_DELIMITER || '',

    // Stripe publishable key (pk_test_ or pk_live_)
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

    // Google OAuth paths (backend handles credentials)
    GOOGLE_LOGIN_PATH: import.meta.env.VITE_GOOGLE_LOGIN_PATH || '/api/Account/GoogleLogin/google-login',
    GOOGLE_CALLBACK_PATH: import.meta.env.VITE_GOOGLE_CALLBACK_PATH || '/api/Account/GoogleCallback/google-callback',
};