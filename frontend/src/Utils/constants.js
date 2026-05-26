// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout'
  },
  STOCKS: {
    ALL: '/stocks',
    SEARCH: '/stocks/search',
    HISTORY: '/stocks/history',
    DETAILS: '/stocks/details'
  },
  MARKET: {
    OVERVIEW: '/market/overview',
    TOP_GAINERS: '/market/top-gainers',
    TOP_LOSERS: '/market/top-losers',
    SECTOR: '/market/sector'
  },
  PORTFOLIO: {
    GET: '/portfolio',
    ADD: '/portfolio/add',
    REMOVE: '/portfolio/remove'
  },
  WATCHLIST: {
    GET: '/watchlist',
    ADD: '/watchlist/add',
    REMOVE: '/watchlist/remove'
  },
  ORDERS: {
    PLACE: '/orders/place',
    HISTORY: '/orders/history',
    CANCEL: '/orders/cancel'
  },
  NEWS: {
    ALL: '/news',
    STOCK_NEWS: '/news/stock'
  }
}

// Order types
export const ORDER_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL'
}

// Order status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  EXECUTED: 'EXECUTED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  PARTIALLY_FILLED: 'PARTIALLY_FILLED'
}

// Order durations
export const ORDER_DURATIONS = {
  DAY: 'DAY',
  GTC: 'GTC', // Good Till Cancelled
  IOC: 'IOC'  // Immediate Or Cancel
}

// Chart timeframes
export const CHART_TIMEFRAMES = {
  '1D': '1d',
  '1W': '1wk',
  '1M': '1mo',
  '3M': '3mo',
  '6M': '6mo',
  '1Y': '1y',
  '5Y': '5y'
}

// Chart intervals
export const CHART_INTERVALS = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '1d': '1d',
  '1wk': '1wk'
}

// Market sectors
export const MARKET_SECTORS = [
  'Technology',
  'Healthcare',
  'Financial',
  'Energy',
  'Consumer Goods',
  'Industrial',
  'Utilities',
  'Real Estate',
  'Materials',
  'Telecommunications'
]

// Indian stock exchanges
export const EXCHANGES = {
  NSE: 'NSE',
  BSE: 'BSE'
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  WATCHLIST: 'watchlist',
  SETTINGS: 'settings'
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  STOCK_NOT_FOUND: 'Stock not found',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_QUANTITY: 'Invalid quantity',
  ORDER_FAILED: 'Order placement failed'
}

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  ADDED_TO_WATCHLIST: 'Added to watchlist',
  REMOVED_FROM_WATCHLIST: 'Removed from watchlist'
}