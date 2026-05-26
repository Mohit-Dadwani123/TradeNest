import React, { useState } from 'react'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { ORDER_STATUS } from '../../utils/constants'

const OrderHistory = ({ orders }) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status) => {
    switch(status) {
      case ORDER_STATUS.EXECUTED:
        return 'text-green-600 bg-green-100'
      case ORDER_STATUS.PENDING:
        return 'text-yellow-600 bg-yellow-100'
      case ORDER_STATUS.CANCELLED:
        return 'text-red-600 bg-red-100'
      case ORDER_STATUS.REJECTED:
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false
    if (searchTerm && !order.symbol.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter(ORDER_STATUS.PENDING)}
              className={`px-3 py-1 rounded ${filter === ORDER_STATUS.PENDING ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter(ORDER_STATUS.EXECUTED)}
              className={`px-3 py-1 rounded ${filter === ORDER_STATUS.EXECUTED ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Executed
            </button>
            <button
              onClick={() => setFilter(ORDER_STATUS.CANCELLED)}
              className={`px-3 py-1 rounded ${filter === ORDER_STATUS.CANCELLED ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Cancelled
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search by symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border rounded-lg"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    order.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {order.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {order.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {formatCurrency(order.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                  {formatCurrency(order.quantity * order.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory