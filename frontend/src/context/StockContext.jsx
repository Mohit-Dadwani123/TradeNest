import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export const StockContext = createContext()

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [marketData, setMarketData] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)

  // Fetch all stocks
  const fetchStocks = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/stocks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStocks(response.data.stocks)
      return response.data.stocks
    } catch (error) {
      console.error('Error fetching stocks:', error)
      toast.error('Failed to fetch stocks')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch single stock details
  const fetchStockDetails = async (symbol) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/stocks/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSelectedStock(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching stock details:', error)
      toast.error('Failed to fetch stock details')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fetch market data (indices, top gainers/losers)
  const fetchMarketData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/market/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMarketData(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching market data:', error)
      return null
    }
  }

  // Fetch user's watchlist
  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/watchlist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWatchlist(response.data.watchlist)
      return response.data.watchlist
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      return []
    }
  }

  // Add to watchlist
  const addToWatchlist = async (stockId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/watchlist`, 
        { stockId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setWatchlist([...watchlist, response.data.stock])
      toast.success('Added to watchlist')
      return true
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      toast.error('Failed to add to watchlist')
      return false
    }
  }

  // Remove from watchlist
  const removeFromWatchlist = async (stockId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_URL}/watchlist/${stockId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWatchlist(watchlist.filter(item => item._id !== stockId))
      toast.success('Removed from watchlist')
      return true
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      toast.error('Failed to remove from watchlist')
      return false
    }
  }

  // Fetch user's portfolio
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPortfolio(response.data.portfolio)
      return response.data.portfolio
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      return []
    }
  }

  // Search stocks
  const searchStocks = async (query) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/stocks/search?q=${query}`)
      return response.data.stocks
    } catch (error) {
      console.error('Error searching stocks:', error)
      return []
    }
  }

  // Get stock historical data for charts
  const getStockHistory = async (symbol, interval = '1d', range = '1mo') => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/stocks/${symbol}/history`, {
        params: { interval, range }
      })
      return response.data.history
    } catch (error) {
      console.error('Error fetching stock history:', error)
      return []
    }
  }

  return (
    <StockContext.Provider value={{
      stocks,
      watchlist,
      portfolio,
      marketData,
      loading,
      selectedStock,
      fetchStocks,
      fetchStockDetails,
      fetchMarketData,
      fetchWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      fetchPortfolio,
      searchStocks,
      getStockHistory,
      setSelectedStock
    }}>
      {children}
    </StockContext.Provider>
  )
}