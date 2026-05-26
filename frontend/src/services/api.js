import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          window.location.href = '/login'
          toast.error('Session expired. Please login again.')
          break
        case 403:
          toast.error('You don\'t have permission to perform this action')
          break
        case 404:
          toast.error('Resource not found')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(error.response.data?.message || 'An error occurred')
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.')
    } else {
      toast.error('An unexpected error occurred')
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (oldPassword, newPassword) => 
    api.put('/auth/change-password', { oldPassword, newPassword })
}

// Stock services
export const stockService = {
  getAllStocks: (params) => api.get('/stocks', { params }),
  getStockBySymbol: (symbol) => api.get(`/stocks/${symbol}`),
  searchStocks: (query) => api.get('/stocks/search', { params: { q: query } }),
  getStockHistory: (symbol, interval, range) => 
    api.get(`/stocks/${symbol}/history`, { params: { interval, range } }),
  getTopGainers: () => api.get('/stocks/top-gainers'),
  getTopLosers: () => api.get('/stocks/top-losers')
}

// Market services
export const marketService = {
  getMarketOverview: () => api.get('/market/overview'),
  getSectorPerformance: () => api.get('/market/sectors'),
  getMarketNews: () => api.get('/market/news')
}

// Portfolio services
export const portfolioService = {
  getPortfolio: () => api.get('/portfolio'),
  addHolding: (data) => api.post('/portfolio/holdings', data),
  removeHolding: (id) => api.delete(`/portfolio/holdings/${id}`),
  getPerformance: () => api.get('/portfolio/performance')
}

// Watchlist services
export const watchlistService = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (stockId) => api.post('/watchlist', { stockId }),
  removeFromWatchlist: (stockId) => api.delete(`/watchlist/${stockId}`),
  reorderWatchlist: (order) => api.put('/watchlist/reorder', { order })
}

// Order services
export const orderService = {
  placeOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params) => api.get('/orders', { params }),
  cancelOrder: (orderId) => api.delete(`/orders/${orderId}`),
  getOrderBook: () => api.get('/orders/book')
}

// News services
export const newsService = {
  getNews: (params) => api.get('/news', { params }),
  getStockNews: (symbol) => api.get(`/news/stock/${symbol}`),
  getTrendingNews: () => api.get('/news/trending')
}

export default api