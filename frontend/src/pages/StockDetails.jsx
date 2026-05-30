import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStockData } from '../hooks/useStockData'
import { useAuth } from '../hooks/useAuth'
import StockChart from '../components/stocks/StockChart'
import OrderForm from '../components/orders/OrderForm'
import { FaArrowLeft, FaStar, FaInfoCircle, FaChartLine, FaNewspaper } from 'react-icons/fa'
import { formatCurrency, formatPercentage } from '../utils/helpers'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadingSpinner'

const StockDetails = () => {
  const { symbol } = useParams()
  const { selectedStock, fetchStockDetails, getStockHistory, addToWatchlist, removeFromWatchlist, watchlist, loading } = useStockData()
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    loadStockData()
    loadHistory()
  }, [symbol])

  useEffect(() => {
    if (watchlist && selectedStock) {
      setIsInWatchlist(watchlist.some(item => item.symbol === selectedStock.symbol))
    }
  }, [watchlist, selectedStock])

  const loadStockData = async () => {
    await fetchStockDetails(symbol)
  }

  const loadHistory = async () => {
    const data = await getStockHistory(symbol)
    setHistory(data)
  }

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add stocks to watchlist')
      return
    }
    
    if (isInWatchlist) {
      await removeFromWatchlist(selectedStock._id)
      setIsInWatchlist(false)
    } else {
      await addToWatchlist(selectedStock._id)
      setIsInWatchlist(true)
    }
  }

  if (loading || !selectedStock) return <LoadingSpinner fullScreen />

  const stockInfo = [
    { label: 'Market Cap', value: formatCurrency(selectedStock.marketCap || 1000000000) },
    { label: 'P/E Ratio', value: selectedStock.peRatio || '18.5' },
    { label: 'Dividend Yield', value: selectedStock.dividend || '1.2%' },
    { label: '52W High', value: formatCurrency(selectedStock.high52Week || selectedStock.price * 1.2) },
    { label: '52W Low', value: formatCurrency(selectedStock.low52Week || selectedStock.price * 0.8) },
    { label: 'Avg Volume', value: (selectedStock.volume || 1000000).toLocaleString() },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/market" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors">
        <FaArrowLeft />
        <span>Back to Market</span>
      </Link>

      {/* Stock Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{selectedStock.symbol}</h1>
              <button
                onClick={handleWatchlistToggle}
                className={`text-2xl transition-colors ${isInWatchlist ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                ★
              </button>
            </div>
            <p className="text-gray-600 text-lg">{selectedStock.name}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatCurrency(selectedStock.price)}</div>
            <div className={`text-lg ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {selectedStock.change >= 0 ? '+' : ''}{formatCurrency(selectedStock.change)} ({formatPercentage(selectedStock.changePercent)})
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'overview' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FaInfoCircle className="inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'charts' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FaChartLine className="inline mr-2" />
          Charts
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'news' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FaNewspaper className="inline mr-2" />
          News
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Key Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stockInfo.map((info, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">{info.label}</span>
                    <span className="font-semibold">{info.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">About {selectedStock.name}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedStock.name} is a leading company in its sector, providing innovative solutions 
                  and delivering consistent growth. The stock has shown strong performance over the years 
                  with increasing revenue and profitability.
                </p>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'charts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <StockChart data={history} height={500} />
            </motion.div>
          )}
          
          {activeTab === 'news' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Latest News</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Sample News Article {item}</h3>
                    <p className="text-gray-600 text-sm">This is a sample news article about {selectedStock.symbol}. Real news will appear here.</p>
                    <span className="text-xs text-gray-400 mt-2 block">2 hours ago</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        <div>
          <OrderForm stock={selectedStock} currentPrice={selectedStock.price} />
        </div>
      </div>
    </div>
  )
}

export default StockDetails