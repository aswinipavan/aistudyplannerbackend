// Mock standard React Native native modules

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    currentUser: { uid: 'test-uid', email: 'test@example.com' },
    signInWithCredential: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: 'test-uid', email: 'test@example.com' });
      return () => {};
    }),
  }),
}));

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: {
    apps: [],
    initializeApp: jest.fn(),
  },
}));

const mockMessaging = () => ({
  getToken: jest.fn(() => Promise.resolve('test-token')),
  requestPermission: jest.fn(() => Promise.resolve(1)), // 1 is AUTHORIZED
  onMessage: jest.fn(() => () => {}),
  onNotificationOpenedApp: jest.fn(() => () => {}),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
});
mockMessaging.AuthorizationStatus = {
  AUTHORIZED: 1,
  PROVISIONAL: 2,
};
jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: mockMessaging,
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ user: { id: 'google-id' } })),
  },
}));

const makeAnimationMock = () => {
  const mock = {
    duration: jest.fn(() => mock),
    delay: jest.fn(() => mock),
    springify: jest.fn(() => mock),
  };
  return mock;
};

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const View = require('react-native').View;
  const animMock = makeAnimationMock();
  return {
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    sub: jest.fn(),
    multiply: jest.fn(),
    divide: jest.fn(),
    pow: jest.fn(),
    modulo: jest.fn(),
    and: jest.fn(),
    or: jest.fn(),
    not: jest.fn(),
    lessThan: jest.fn(),
    eq: jest.fn(),
    greaterThan: jest.fn(),
    lessOrEq: jest.fn(),
    greaterOrEq: jest.fn(),
    neq: jest.fn(),
    decay: jest.fn(),
    timing: jest.fn(() => ({ start: jest.fn() })),
    spring: jest.fn(() => ({ start: jest.fn() })),
    delay: jest.fn(),
    sequence: jest.fn(),
    parallel: jest.fn(),
    stagger: jest.fn(),
    loop: jest.fn(),
    createAnimatedComponent: (Component) => Component,
    View: View,
    Text: require('react-native').Text,
    ScrollView: require('react-native').ScrollView,
    Image: require('react-native').Image,
    useSharedValue: (val) => ({ value: val }),
    useAnimatedStyle: (callback) => callback(),
    useAnimatedScrollHandler: () => jest.fn(),
    useAnimatedGestureHandler: () => jest.fn(),
    useAnimatedRef: () => ({ current: null }),
    useDerivedValue: (callback) => ({ value: callback() }),
    withTiming: (toValue, _, callback) => {
      if (callback) callback(true);
      return toValue;
    },
    withSpring: (toValue, _, callback) => {
      if (callback) callback(true);
      return toValue;
    },
    withDecay: (toValue, _, callback) => {
      if (callback) callback(true);
      return toValue;
    },
    withSequence: (...animations) => animations[animations.length - 1],
    withRepeat: (animation) => animation,
    cancelAnimation: jest.fn(),
    interpolate: (value, inputRange, outputRange) => value,
    interpolateColor: (value, inputRange, outputRange) => outputRange[0],
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      poly: jest.fn(),
      sin: jest.fn(),
      circle: jest.fn(),
      exp: jest.fn(),
      elastic: jest.fn(),
      back: jest.fn(),
      bounce: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    FadeInDown: animMock,
    FadeInUp: animMock,
    FadeOutUp: animMock,
  };
});

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

jest.mock('react-native-razorpay', () => ({
  RazorpayCheckout: {
    open: jest.fn(),
  },
}));

jest.mock('react-native-document-picker', () => ({
  __esModule: true,
  default: {
    pick: jest.fn(),
    pickMultiple: jest.fn(),
    pickSingle: jest.fn(),
  },
  types: {
    allFiles: 'allFiles',
    images: 'images',
    plainText: 'plainText',
    audio: 'audio',
    pdf: 'pdf',
    zip: 'zip',
    csv: 'csv',
    doc: 'doc',
    docx: 'docx',
    xls: 'xls',
    xlsx: 'xlsx',
    ppt: 'ppt',
    pptx: 'pptx',
  },
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 0, height: 0 }),
    SafeAreaInsetsContext: React.createContext(inset),
    SafeAreaFrameContext: React.createContext({ x: 0, y: 0, width: 0, height: 0 }),
  };
});

jest.mock('react-native-screens', () => {
  const React = require('react');
  return {
    enableScreens: jest.fn(),
    ScreenContainer: ({ children }) => React.createElement('ScreenContainer', null, children),
    Screen: ({ children }) => React.createElement('Screen', null, children),
    ScreenStack: ({ children }) => React.createElement('ScreenStack', null, children),
    ScreenStackItem: ({ children }) => React.createElement('ScreenStackItem', null, children),
    ScreenStackHeaderConfig: ({ children }) => React.createElement('ScreenStackHeaderConfig', null, children),
    ScreenStackHeaderSubview: ({ children }) => React.createElement('ScreenStackHeaderSubview', null, children),
    SearchBar: ({ children }) => React.createElement('SearchBar', null, children),
    compatibilityFlags: {},
  };
});

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  State: {},
  PanGestureHandler: ({ children }) => children,
  BaseButton: ({ children }) => children,
  RectButton: ({ children }) => children,
  TouchableOpacity: ({ children }) => children,
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  useNetInfo: () => ({ isConnected: true }),
  fetch: () => Promise.resolve({ isConnected: true }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const createMockComponent = (name) => {
    return (props) => React.createElement(name, props, props.children);
  };
  return {
    Svg: createMockComponent('Svg'),
    Circle: createMockComponent('Circle'),
    Ellipse: createMockComponent('Ellipse'),
    G: createMockComponent('G'),
    Text: createMockComponent('Text'),
    TSpan: createMockComponent('TSpan'),
    TextPath: createMockComponent('TextPath'),
    Path: createMockComponent('Path'),
    Polygon: createMockComponent('Polygon'),
    Polyline: createMockComponent('Polyline'),
    Line: createMockComponent('Line'),
    Rect: createMockComponent('Rect'),
    Use: createMockComponent('Use'),
    Image: createMockComponent('Image'),
    Symbol: createMockComponent('Symbol'),
    Defs: createMockComponent('Defs'),
    LinearGradient: createMockComponent('LinearGradient'),
    RadialGradient: createMockComponent('RadialGradient'),
    Stop: createMockComponent('Stop'),
    ClipPath: createMockComponent('ClipPath'),
    Pattern: createMockComponent('Pattern'),
    Mask: createMockComponent('Mask'),
    default: createMockComponent('Svg'),
  };
});

// Mock other components if necessary
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
