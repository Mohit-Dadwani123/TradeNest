import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStockData } from '../hooks/useStockData'
import { FaTrash, FaStar, FaChartLine } from 'react-icons/fa'
import { formatCurrency, formatPercentage } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const WatchlistPage = () => {
  const { watchlist, fetchWatchlist, removeFromWatchlist, loading } = useStockData()
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const handleRemove = async (stockId, stockSymbol) => {
    setRemovingId(stockId)
    try {
      await removeFromWatchlist(stockId)
      toast.success(`${stockSymbol} removed from watchlist`)
    } catch (error) {
      toast.error('Failed to remove from watchlist')
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gradient-text">My Watchlist</h1>
        <Link to="/market" className="btn-outline">
          Add More Stocks
        </Link>
      </div>

      {watchlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-xl shadow-lg"
        >
          <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your watchlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding stocks to track their performance</p>
          <Link to="/market" className="btn-primary inline-block">
            Browse Market
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((stock, idx) => (
            <motion.div
              key={stock._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card-gradient group"
            >
              <Link to={`/stock/${stock.symbol}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
                    <p className="text-gray-600 text-sm">{stock.name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemove(stock._id, stock.symbol)
                    }}
                    disabled={removingId === stock._id}
                    className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {removingId === stock._id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold">{formatCurrency(stock.price)}</div>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Volume: {stock.volume?.toLocaleString()}</span>
                  <FaChartLine className="text-primary-600" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WatchlistPage