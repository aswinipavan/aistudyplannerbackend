declare namespace NodeJS {
  interface ProcessEnv {
    API_BASE_URL: string;
    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    RAZORPAY_KEY_ID: string;
    ENABLE_FLIPPER: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
