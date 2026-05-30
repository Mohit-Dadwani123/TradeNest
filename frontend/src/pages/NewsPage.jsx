import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaNewspaper, FaSearch, FaCalendar, FaShare } from 'react-icons/fa'
import { formatDate } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

const NewsPage = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    // Mock news data
    setTimeout(() => {
      setNews([
        {
          id: 1,
          title: 'Markets Hit All-Time High as Tech Stocks Rally',
          summary: 'Technology stocks led the rally as investors remain optimistic about AI and cloud computing growth.',
          source: 'Financial Times',
          category: 'market',
          publishedAt: new Date(),
          imageUrl: 'https://via.placeholder.com/400x200'
        },
        {
          id: 2,
          title: 'RBI Keeps Interest Rates Unchanged',
          summary: 'The Reserve Bank of India maintains repo rate at 6.5%, citing inflation concerns.',
          source: 'Economic Times',
          category: 'economy',
          publishedAt: new Date(Date.now() - 86400000),
          imageUrl: 'https://via.placeholder.com/400x200'
        },
        {
          id: 3,
          title: 'Reliance Announces New Green Energy Partnership',
          summary: 'Reliance Industries partners with global leaders to accelerate green energy transition.',
          source: 'Business Standard',
          category: 'stocks',
          publishedAt: new Date(Date.now() - 172800000),
          imageUrl: 'https://via.placeholder.com/400x200'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'market', label: 'Market' },
    { value: 'economy', label: 'Economy' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'ipo', label: 'IPO' },
  ]

  const filteredNews = news.filter(item => {
    if (category !== 'all' && item.category !== category) return false
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold gradient-text mb-6">Market News</h1>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  category === cat.value ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card-gradient cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <div className="relative">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-lg text-xs">
                {item.category.toUpperCase()}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{item.summary}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaNewspaper />
                  <span>{item.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button className="text-primary-600 hover:text-primary-700 font-semibold">
                  Read More →
                </button>
                <button className="text-gray-400 hover:text-primary-600 transition-colors">
                  <FaShare />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No news found</p>
        </div>
      )}
    </div>
  )
}

export default NewsPage