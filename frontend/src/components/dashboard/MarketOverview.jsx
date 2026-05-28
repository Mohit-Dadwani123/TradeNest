import React from 'react'
import { formatCurrency, formatPercentage } from '../../utils/helpers'

const MarketOverview = ({ marketData }) => {
  const indices = marketData?.indices || [
    { name: 'NIFTY 50', value: 21456.75, change: 245.30, changePercent: 1.16 },
    { name: 'SENSEX', value: 71234.50, change: 678.90, changePercent: 0.96 },
    { name: 'BANK NIFTY', value: 45678.25, change: 345.60, changePercent: 0.76 }
  ]
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Market Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((index, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="font-semibold text-gray-600">{index.name}</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(index.value)}</div>
            <div className={`mt-1 ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {index.change >= 0 ? '+' : ''}{formatCurrency(index.change)} ({formatPercentage(index.changePercent)})
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketOverview