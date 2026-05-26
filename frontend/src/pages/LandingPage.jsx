import React from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaShieldAlt, FaUsers, FaRocket } from 'react-icons/fa'

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Trade Stocks with Confidence</h1>
            <p className="text-xl mb-8">Real-time data, advanced charts, and secure trading platform</p>
            <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
              <p className="text-gray-600">Live market data with zero delay</p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Trading</h3>
              <p className="text-gray-600">Bank-level security for your investments</p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Community</h3>
              <p className="text-gray-600">Connect with experienced traders</p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Execution</h3>
              <p className="text-gray-600">Lightning-fast order execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Market Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['NIFTY 50', 'SENSEX', 'BANK NIFTY'].map((index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold mb-2">{index}</h3>
                <div className="text-2xl font-bold">21,456.75</div>
                <div className="text-green-600">+245.30 (+1.16%)</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage