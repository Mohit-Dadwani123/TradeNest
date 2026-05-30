import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaChartLine, FaUser, FaBell, FaSearch, FaBars, FaTimes,
  FaCog, FaWallet, FaHistory, FaSignOutAlt, FaHome
} from 'react-icons/fa'
import NotificationBadge from './NotificationBadge'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/market', label: 'Market', icon: FaChartLine },
    { path: '/portfolio', label: 'Portfolio', icon: FaWallet },
    { path: '/watchlist', label: 'Watchlist', icon: FaChartLine },
    { path: '/news', label: 'News', icon: FaChartLine },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-lg' : 'bg-white shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaChartLine className="text-primary-600 text-2xl" />
            </motion.div>
            <span className="font-bold text-xl gradient-text">StockMarket</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 rounded-lg transition-all duration-200 hover:bg-primary-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search stocks, ETFs, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </form>

          {/* Right Section */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FaBell className="text-gray-600 text-xl" />
                <NotificationBadge count={notifications} />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="hidden md:inline text-gray-700 font-medium">{user.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors">
                          <FaCog className="mr-3 text-gray-500" />
                          <span>Profile Settings</span>
                        </Link>
                        <Link to="/orders" className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors">
                          <FaHistory className="mr-3 text-gray-500" />
                          <span>Order History</span>
                        </Link>
                        <Link to="/transactions" className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors">
                          <FaWallet className="mr-3 text-gray-500" />
                          <span>Transactions</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FaSignOutAlt className="mr-3" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-gray-100">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search stocks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </form>
                
                {/* Mobile Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar