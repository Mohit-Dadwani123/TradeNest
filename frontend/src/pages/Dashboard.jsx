import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useStockData } from '../hooks/useStockData'
import { 
  FaWallet, FaChartLine, FaArrowUp, 
  FaArrowDown, FaEye, FaClock, FaStar 
} from 'react-icons/fa'
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const { portfolio, loading } = useStockData()
  const [greeting, setGreeting] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1W')
  const [portfolioData, setPortfolioData] = useState([])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning ☀️')
    else if (hour < 17) setGreeting('Good Afternoon 🌤️')
    else setGreeting('Good Evening 🌙')
    
    // Mock portfolio performance data
    setPortfolioData([
      { date: 'Mon', value: 100000 },
      { date: 'Tue', value: 102500 },
      { date: 'Wed', value: 101800 },
      { date: 'Thu', value: 104200 },
      { date: 'Fri', value: 106500 },
    ])
  }, [])

  const stats = [
    { 
      title: 'Portfolio Value', 
      value: '₹10,65,000', 
      change: '+5.2%', 
      positive: true,
      icon: FaWallet,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: "Today's P&L", 
      value: '+₹24,500', 
      change: '+2.35%', 
      positive: true,
      icon: FaChartLine,
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Total Returns', 
      value: '₹1,85,000', 
      change: '+21.0%', 
      positive: true,
      icon: FaChartLine,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Buying Power', 
      value: '₹5,00,000', 
      change: 'Available', 
      positive: true,
      icon: FaWallet,
      color: 'from-orange-500 to-orange-600'
    },
  ]

  const recentTrades = [
    { symbol: 'RELIANCE', type: 'BUY', quantity: 10, price: 2456.75, time: '10:30 AM' },
    { symbol: 'TCS', type: 'SELL', quantity: 5, price: 3567.80, time: '09:45 AM' },
    { symbol: 'HDFC', type: 'BUY', quantity: 20, price: 1678.90, time: 'Yesterday' },
  ]

  const watchlistStocks = [
    { symbol: 'RELIANCE', price: 2456.75, change: 45.30, changePercent: 1.88 },
    { symbol: 'TCS', price: 3567.80, change: -23.45, changePercent: -0.65 },
    { symbol: 'INFY', price: 1567.25, change: 23.15, changePercent: 1.50 },
  ]

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text">
          {greeting}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your portfolio today</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-gradient relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-3">
                <stat.icon className="text-3xl text-primary-600" />
                <span className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart and Watchlist Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 card"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Portfolio Performance</h3>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    selectedTimeframe === tf 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => `₹${value/1000}K`} />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fill="url(#colorGradient)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Watchlist */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Watchlist</h3>
            <FaEye className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {watchlistStocks.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-900">{stock.symbol}</p>
                  <p className="text-sm text-gray-500">₹{stock.price.toFixed(2)}</p>
                </div>
                <div className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <p className="font-semibold">{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}</p>
                  <p className="text-sm">({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-primary-600 text-center hover:underline">
            View Full Watchlist →
          </button>
        </motion.div>
      </div>

      {/* Recent Trades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Recent Trades</h3>
          <FaClock className="text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Symbol</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Quantity</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Price</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTrades.map((trade, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold">{trade.symbol}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      trade.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{trade.quantity}</td>
                  <td className="px-4 py-3 text-right">₹{trade.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard