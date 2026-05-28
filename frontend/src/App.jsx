import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { StockProvider } from './context/StockContext'
import PrivateRoute from './components/common/PrivateRoute'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// Pages - Import without .jsx extension (Vite handles it)
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MarketPage from './pages/MarketPage'
import StockDetails from './pages/StockDetails'
import WatchlistPage from './pages/WatchlistPage'
import PortfolioPage from './pages/PortfolioPage'
import OrdersPage from './pages/OrdersPage'
import NewsPage from './pages/NewsPage'
import ProfileSettings from './pages/ProfileSettings'
import SearchPage from './pages/SearchPage'
import TransactionHistory from './pages/TransactionHistory'

function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/market" element={<MarketPage />} />
                <Route path="/stock/:symbol" element={<StockDetails />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/transactions" element={<TransactionHistory />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </StockProvider>
    </AuthProvider>
  )
}

export default App