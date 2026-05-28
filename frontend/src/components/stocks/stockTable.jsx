import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatPercentage } from '../../utils/helpers'

const StockTable = ({ stocks }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">Symbol</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-right">Price</th>
            <th className="px-6 py-3 text-right">Change</th>
            <th className="px-6 py-3 text-right">Volume</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold">{stock.symbol}</td>
              <td className="px-6 py-4">{stock.name}</td>
              <td className="px-6 py-4 text-right">{formatCurrency(stock.price)}</td>
              <td className={`px-6 py-4 text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change} ({formatPercentage(stock.changePercent)})
              </td>
              <td className="px-6 py-4 text-right">{stock.volume?.toLocaleString()}</td>
              <td className="px-6 py-4 text-center">
                <Link to={`/stock/${stock.symbol}`} className="text-primary hover:underline">
                  Trade
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockTable