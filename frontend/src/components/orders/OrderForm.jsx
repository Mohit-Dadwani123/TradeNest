import React, { useState } from 'react'
import { ORDER_TYPES, ORDER_DURATIONS } from '../../utils/constants'
import { validateQuantity, validatePrice } from '../../utils/validators'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const OrderForm = ({ stock, currentPrice, onPlaceOrder }) => {
  const [orderType, setOrderType] = useState(ORDER_TYPES.BUY)
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState(currentPrice)
  const [duration, setDuration] = useState(ORDER_DURATIONS.DAY)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!validateQuantity(quantity)) {
      toast.error('Please enter a valid quantity (1-100,000)')
      return
    }
    
    if (orderType === ORDER_TYPES.BUY && !validatePrice(price)) {
      toast.error('Please enter a valid price')
      return
    }
    
    const orderData = {
      symbol: stock.symbol,
      type: orderType,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      duration,
      timestamp: new Date()
    }
    
    setIsSubmitting(true)
    try {
      await onPlaceOrder(orderData)
      setQuantity('')
      if (orderType !== ORDER_TYPES.BUY) {
        setPrice(currentPrice)
      }
    } catch (error) {
      console.error('Order failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalValue = quantity && price ? quantity * price : 0

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Place Order - {stock.symbol}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Current Price:</span>
          <span className="font-bold text-lg">{formatCurrency(currentPrice)}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setOrderType(ORDER_TYPES.BUY)}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            orderType === ORDER_TYPES.BUY
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setOrderType(ORDER_TYPES.SELL)}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            orderType === ORDER_TYPES.SELL
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          SELL
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field"
            placeholder="Enter quantity"
            min="1"
            max="100000"
            required
          />
        </div>
        
        {orderType === ORDER_TYPES.BUY && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Limit Price (Optional)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              placeholder="Market price if empty"
              step="0.05"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for market order</p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Order Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-field"
          >
            <option value={ORDER_DURATIONS.DAY}>Day</option>
            <option value={ORDER_DURATIONS.GTC}>Good Till Cancelled (GTC)</option>
            <option value={ORDER_DURATIONS.IOC}>Immediate or Cancel (IOC)</option>
          </select>
        </div>
        
        {quantity && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Total Value:</span>
              <span className="font-bold">{formatCurrency(totalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Charges:</span>
              <span className="text-gray-600">{formatCurrency(totalValue * 0.0005)}</span>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || !quantity}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            orderType === ORDER_TYPES.BUY
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          } ${(isSubmitting || !quantity) && 'opacity-50 cursor-not-allowed'}`}
        >
          {isSubmitting 
            ? 'Processing...' 
            : `${orderType} ${stock.symbol}`
          }
        </button>
      </form>
    </div>
  )
}

export default OrderForm