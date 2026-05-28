import React from 'react'
import { useParams } from 'react-router-dom'

const StockDetails = () => {
  const { symbol } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stock Details: {symbol}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Stock details for {symbol} will appear here</p>
      </div>
    </div>
  )
}

export default StockDetails