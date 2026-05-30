import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStockData } from '../hooks/useStockData'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { formatCurrency, formatPercentage } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { searchStocks } = useStockData()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery) => {
    setLoading(true)
    // Mock search results
    setTimeout(() => {
      const mockResults = [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2456.75, change: 45.30, changePercent: 1.88 },
        { symbol: 'RELIANCEPOWER', name: 'Reliance Power Ltd.', price: 25.50, change: -1.20, changePercent: -4.49 },
        { symbol: 'RELIANCECAP', name: 'Reliance Capital Ltd.', price: 15.75, change: 0.50, changePercent: 3.28 },
      ].filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(mockResults)
      setLoading(false)
    }, 500)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.location.href = `/search?q=${searchInput}`
    }
  }

  const clearSearch = () => {
    setSearchInput('')
    window.location.href = '/market'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by stock symbol or company name..."
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {query && (
              <h2 className="text-2xl font-bold mb-6">
                Search Results for "{query}"
                <span className="text-gray-500 text-lg ml-2">({results.length} results)</span>
              </h2>
            )}

            {results.length === 0 && query && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching with a different symbol or company name</p>
              </div>
            )}

            <div className="space-y-4">
              {results.map((stock, idx) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <Link to={`/stock/${stock.symbol}`} className="block">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
                        <p className="text-gray-600">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{formatCurrency(stock.price)}</p>
                        <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchPage