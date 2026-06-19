export const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
  error: (message: string, error?: any) => {
    // Strip sensitive keys from the error object if it exists
    let sanitizedError = error;
    if (process.env.NODE_ENV === 'production' && error) {
      try {
        const errorString = JSON.stringify(error, (key, value) => {
          if (['password', 'token', 'secret', 'key'].includes(key.toLowerCase())) {
            return '[REDACTED]';
          }
          return value;
        });
        sanitizedError = JSON.parse(errorString);
      } catch (e) {
        sanitizedError = 'Unparseable error object';
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.error(message, sanitizedError);
    } else {
      // In production, send to Crashlytics/Sentry (mocked here)
      console.log('Sending sanitized error to monitoring:', message);
    }
  }
};
