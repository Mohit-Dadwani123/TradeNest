import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter } from 'react-icons/fa'
import { formatCurrency, formatDate } from '../utils/helpers'
import { ORDER_STATUS } from '../utils/constants'
import LoadingSpinner from '../components/common/LoadingSpinner'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock orders data
    setTimeout(() => {
      setOrders([
        {
          _id: '1',
          symbol: 'RELIANCE',
          type: 'BUY',
          quantity: 10,
          price: 2456.75,
          total: 24567.50,
          status: 'EXECUTED',
          createdAt: new Date('2024-01-15T10:30:00')
        },
        {
          _id: '2',
          symbol: 'TCS',
          type: 'SELL',
          quantity: 5,
          price: 3567.80,
          total: 17839.00,
          status: 'EXECUTED',
          createdAt: new Date('2024-01-14T14:45:00')
        },
        {
          _id: '3',
          symbol: 'HDFC',
          type: 'BUY',
          quantity: 20,
          price: 1678.90,
          total: 33578.00,
          status: 'PENDING',
          createdAt: new Date('2024-01-16T09:15:00')
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'EXECUTED': return 'bg-green-100 text-green-700'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false
    if (searchTerm && !order.symbol.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold gradient-text mb-6">Order History</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('EXECUTED')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'EXECUTED' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Executed
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Symbol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Quantity</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Price</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order, idx) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 font-semibold">{order.symbol}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">{order.quantity}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(order.price)}</td>
                  <td className="px-6 py-4 text-right font-semibold">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage