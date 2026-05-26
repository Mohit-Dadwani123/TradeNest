import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useStockData } from '../hooks/useStockData'
import { useWebSocket } from '../hooks/useWebSocket'
import PortfolioSummary from '../components/dashboard/PortfolioSummary'
import WatchlistWidget from '../components/dashboard/WatchlistWidget'
import MarketOverview from '../components/dashboard/MarketOverview'
import Loader from '../components/common/Loader'
import { formatCurrency } from '../utils/helpers'

const Dashboard = () => {
  const { user } = useAuth()
  const { portfolio, watchlist, marketData, fetchPortfolio, fetchWatchlist, fetchMarketData, loading } = useStockData()
  const { livePrices } = useWebSocket(watchlist.map(w => w.symbol))
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
    
    fetchPortfolio()
    fetchWatchlist()
    fetchMarketData()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {greeting}, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Welcome back to your trading dashboard</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">Portfolio Value</p>
          <p className="text-2xl font-bold">{formatCurrency(1234567)}</p>
          <p className="text-sm mt-1">+2.5% today</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">Today's P&L</p>
          <p className="text-2xl font-bold">{formatCurrency(15432)}</p>
          <p className="text-sm mt-1">+1.2%</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">Total Returns</p>
          <p className="text-2xl font-bold">{formatCurrency(98765)}</p>
          <p className="text-sm mt-1">+8.7% all time</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">Buying Power</p>
          <p className="text-2xl font-bold">{formatCurrency(500000)}</p>
          <p className="text-sm mt-1">Available for trading</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioSummary holdings={portfolio} />
        </div>
        <div>
          <WatchlistWidget watchlist={watchlist} livePrices={livePrices} />
        </div>
      </div>
      
      {/* Market Overview */}
      <div className="mt-8">
        <MarketOverview marketData={marketData} />
      </div>
    </div>
  )
}

export default Dashboard