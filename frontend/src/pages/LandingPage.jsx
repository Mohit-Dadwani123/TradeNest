import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  FaChartLine, FaShieldAlt, FaBolt, FaUsers, 
  FaRobot, FaMobileAlt, FaArrowRight, FaStar 
} from 'react-icons/fa'

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="card-gradient group hover:scale-105 transition-all duration-300"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-white text-2xl" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

const StatCard = ({ value, label, delay }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-4xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  )
}

const LandingPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6"
            >
              <FaStar className="text-yellow-500" />
              <span className="text-sm font-semibold">Trusted by 100,000+ Traders</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Trade Stocks with{' '}
              <span className="gradient-text">Confidence</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Real-time data, advanced charts, and secure trading platform. 
              Join millions of investors who trust us for their trading journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg">
                Start Trading Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/market" className="btn-outline inline-flex items-center gap-2 text-lg">
                View Markets
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Real-time Data</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-500" />
                <span className="text-sm text-gray-600">SEC Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBolt className="text-yellow-500" />
                <span className="text-sm text-gray-600">Instant Execution</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-300 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="$50B+" label="Trading Volume" delay={0} />
            <StatCard value="100K+" label="Active Traders" delay={0.1} />
            <StatCard value="99.99%" label="Uptime" delay={0.2} />
            <StatCard value="24/7" label="Support" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why Choose{' '}
              <span className="gradient-text">StockMarket</span>
            </h2>
            <p className="text-xl text-gray-600">
              We provide everything you need to succeed in the stock market
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaChartLine}
              title="Real-time Data"
              description="Live market data with zero delay. Get instant price updates and make informed decisions."
              delay={0}
            />
            <FeatureCard
              icon={FaShieldAlt}
              title="Bank-level Security"
              description="Your investments are protected with military-grade encryption and security protocols."
              delay={0.1}
            />
            <FeatureCard
              icon={FaBolt}
              title="Lightning Fast"
              description="Execute trades in milliseconds with our high-performance trading engine."
              delay={0.2}
            />
            <FeatureCard
              icon={FaUsers}
              title="Community Trading"
              description="Connect with expert traders, share insights, and learn from the best."
              delay={0.3}
            />
            <FeatureCard
              icon={FaRobot}
              title="AI-Powered Insights"
              description="Get intelligent trading recommendations based on market analysis."
              delay={0.4}
            />
            <FeatureCard
              icon={FaMobileAlt}
              title="Mobile Trading"
              description="Trade anytime, anywhere with our powerful mobile platform."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who are already making profits with our platform
            </p>
            <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 inline-flex items-center gap-2 text-lg shadow-lg">
              Create Free Account
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage