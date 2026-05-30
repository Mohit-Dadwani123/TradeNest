import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStockData } from '../hooks/useStockData'
import { FaWallet, FaChartLine, FaArrowUp, FaArrowDown, FaDollarSign } from 'react-icons/fa'
import { formatCurrency, formatPercentage, calculatePortfolioSummary } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const PortfolioPage = () => {
  const { portfolio, fetchPortfolio, loading } = useStockData()
  const [summary, setSummary] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('1M')

  useEffect(() => {
    fetchPortfolio()
  }, [])

  useEffect(() => {
    if (portfolio.length > 0) {
      setSummary(calculatePortfolioSummary(portfolio))
    }
  }, [portfolio])

  // Mock portfolio data for demonstration
  const mockPortfolio = [
    { symbol: 'RELIANCE', quantity: 10, buyPrice: 2350.00, currentPrice: 2456.75, pl: 1067.50, plPercentage: 4.54 },
    { symbol: 'TCS', quantity: 5, buyPrice: 3450.00, currentPrice: 3567.80, pl: 589.00, plPercentage: 3.41 },
    { symbol: 'HDFC', quantity: 20, buyPrice: 1600.00, currentPrice: 1678.90, pl: 1578.00, plPercentage: 4.93 },
    { symbol: 'INFY', quantity: 15, buyPrice: 1450.00, currentPrice: 1567.25, pl: 1758.75, plPercentage: 8.09 },
  ]

  const displayPortfolio = portfolio.length > 0 ? portfolio : mockPortfolio
  
  // Pie chart data
  const pieData = displayPortfolio.map(holding => ({
    name: holding.symbol,
    value: holding.currentPrice * holding.quantity
  }))
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold gradient-text mb-6">My Portfolio</h1>

      {displayPortfolio.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <FaWallet className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No investments yet</h3>
          <p className="text-gray-500 mb-6">Start building your portfolio by buying stocks</p>
        </div>
      ) : (
        <>
          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-gradient"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">Total Investment</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(summary?.totalInvestment || 0)}</p>
                </div>
                <FaDollarSign className="text-2xl text-primary-600" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-gradient"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">Current Value</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(summary?.totalCurrentValue || 0)}</p>
                </div>
                <FaChartLine className="text-2xl text-green-600" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-gradient"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">Total P&L</p>
                  <p className={`text-2xl font-bold mt-1 ${(summary?.totalPL || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(summary?.totalPL || 0)}
                  </p>
                </div>
                {(summary?.totalPL || 0) >= 0 ? <FaArrowUp className="text-2xl text-green-600" /> : <FaArrowDown className="text-2xl text-red-600" />}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-gradient"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">Total Returns %</p>
                  <p className={`text-2xl font-bold mt-1 ${(summary?.totalPLPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(summary?.totalPLPercentage || 0)}
                  </p>
                </div>
                <FaChartLine className="text-2xl text-primary-600" />
              </div>
            </motion.div>
          </div>

          {/* Portfolio Allocation Chart and Holdings */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Portfolio Allocation</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">No data to display</div>
              )}
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">Holdings Details</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {displayPortfolio.map((holding, idx) => (
                  <div key={idx} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">{holding.symbol}</span>
                      <span className="text-sm text-gray-500">{holding.quantity} shares</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Buy Price</span>
                      <span>{formatCurrency(holding.buyPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Current Price</span>
                      <span>{formatCurrency(holding.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-600">P&L</span>
                      <span className={holding.pl >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(holding.pl)} ({formatPercentage(holding.plPercentage)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PortfolioPage