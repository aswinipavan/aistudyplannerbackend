module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(postprocessing|@react-native|react-native|@react-navigation|@react-native-community|@react-native-firebase|@react-native-google-signin|firebase|@firebase|react-native-[a-zA-Z0-9\\-]+|@react-native-[a-zA-Z0-9\\-]+)/)',
  ],
};

