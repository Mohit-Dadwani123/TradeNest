import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStockData } from '../hooks/useStockData'
import { FaSearch, FaFilter, FaArrowUp, FaArrowDown, FaStar } from 'react-icons/fa'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency, formatPercentage } from '../utils/helpers'

const MarketPage = () => {
  const { stocks, fetchStocks, loading } = useStockData()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('symbol')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterType, setFilterType] = useState('all')
  const [filteredStocks, setFilteredStocks] = useState([])

  const marketIndices = [
    { name: 'NIFTY 50', value: 21456.75, change: 245.30, changePercent: 1.16 },
    { name: 'SENSEX', value: 71234.50, change: 678.90, changePercent: 0.96 },
    { name: 'BANK NIFTY', value: 45678.25, change: 345.60, changePercent: 0.76 },
  ]

  useEffect(() => {
    fetchStocks()
  }, [])

  useEffect(() => {
    let filtered = [...stocks]
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Type filter
    if (filterType === 'gainers') {
      filtered = filtered.filter(stock => stock.changePercent > 0)
    } else if (filterType === 'losers') {
      filtered = filtered.filter(stock => stock.changePercent < 0)
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    
    setFilteredStocks(filtered)
  }, [stocks, searchTerm, sortBy, sortOrder, filterType])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? <FaArrowUp className="inline ml-1" /> : <FaArrowDown className="inline ml-1" />
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Market Indices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {marketIndices.map((index, idx) => (
          <div key={idx} className="card-gradient">
            <p className="text-gray-600 text-sm">{index.name}</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(index.value)}</p>
            <p className={`text-sm mt-1 ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {index.change >= 0 ? '+' : ''}{formatCurrency(index.change)} ({formatPercentage(index.changePercent)})
            </p>
          </div>
        ))}
      </motion.div>

      {/* Market Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gradient-text">Market Overview</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterType === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Stocks
          </button>
          <button
            onClick={() => setFilterType('gainers')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterType === 'gainers' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setFilterType('losers')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterType === 'losers' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Top Losers
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by symbol or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FaFilter />
              <span>Advanced Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('symbol')}
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Symbol {getSortIcon('symbol')}
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Company {getSortIcon('name')}
                </th>
                <th 
                  onClick={() => handleSort('price')}
                  className="px-6 py-4 text-right text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Price {getSortIcon('price')}
                </th>
                <th 
                  onClick={() => handleSort('change')}
                  className="px-6 py-4 text-right text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Change {getSortIcon('change')}
                </th>
                <th 
                  onClick={() => handleSort('changePercent')}
                  className="px-6 py-4 text-right text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Change % {getSortIcon('changePercent')}
                </th>
                <th 
                  onClick={() => handleSort('volume')}
                  className="px-6 py-4 text-right text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Volume {getSortIcon('volume')}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStocks.map((stock, idx) => (
                <motion.tr
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/stock/${stock.symbol}`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">{stock.symbol}</td>
                  <td className="px-6 py-4 text-gray-600">{stock.name}</td>
                  <td className="px-6 py-4 text-right font-semibold">{formatCurrency(stock.price)}</td>
                  <td className={`px-6 py-4 text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                  </td>
                  <td className={`px-6 py-4 text-right ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{formatPercentage(stock.changePercent)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">{stock.volume?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = `/stock/${stock.symbol}`
                      }}
                    >
                      Trade
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No stocks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketPage