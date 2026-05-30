import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { StockProvider } from './context/StockContext'
import PrivateRoute from './components/common/PrivateRoute'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ScrollToTop from './components/common/ScrollToTop'
import PageTransition from './components/common/PageTransition'

// Pages
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
  const location = useLocation()

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <AuthProvider>
      <StockProvider>
        <div className="min-h-screen flex flex-col relative">
          <Navbar />
          <ScrollToTop />
          <main className="flex-grow pt-16">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                  <PageTransition>
                    <LandingPage />
                  </PageTransition>
                } />
                <Route path="/login" element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                } />
                <Route path="/register" element={
                  <PageTransition>
                    <Register />
                  </PageTransition>
                } />
                <Route path="/search" element={
                  <PageTransition>
                    <SearchPage />
                  </PageTransition>
                } />
                
                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  } />
                  <Route path="/market" element={
                    <PageTransition>
                      <MarketPage />
                    </PageTransition>
                  } />
                  <Route path="/stock/:symbol" element={
                    <PageTransition>
                      <StockDetails />
                    </PageTransition>
                  } />
                  <Route path="/watchlist" element={
                    <PageTransition>
                      <WatchlistPage />
                    </PageTransition>
                  } />
                  <Route path="/portfolio" element={
                    <PageTransition>
                      <PortfolioPage />
                    </PageTransition>
                  } />
                  <Route path="/orders" element={
                    <PageTransition>
                      <OrdersPage />
                    </PageTransition>
                  } />
                  <Route path="/transactions" element={
                    <PageTransition>
                      <TransactionHistory />
                    </PageTransition>
                  } />
                  <Route path="/news" element={
                    <PageTransition>
                      <NewsPage />
                    </PageTransition>
                  } />
                  <Route path="/profile" element={
                    <PageTransition>
                      <ProfileSettings />
                    </PageTransition>
                  } />
                </Route>
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </StockProvider>
    </AuthProvider>
  )
}

export default App