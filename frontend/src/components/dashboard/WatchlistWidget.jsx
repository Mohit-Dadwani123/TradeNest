import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/helpers'

const WatchlistWidget = ({ watchlist, livePrices }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Watchlist</h3>
      {watchlist.length === 0 ? (
        <p className="text-gray-500">No stocks in watchlist</p>
      ) : (
        <div className="space-y-3">
          {watchlist.slice(0, 5).map((stock) => (
            <Link key={stock._id} to={`/stock/${stock.symbol}`}>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-sm text-gray-500">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(livePrices[stock.symbol]?.price || stock.price)}
                  </div>
                  <div className={`text-sm ${
                    (livePrices[stock.symbol]?.change || stock.change) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {(livePrices[stock.symbol]?.change || stock.change) >= 0 ? '+' : ''}
                    {livePrices[stock.symbol]?.change || stock.change}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link to="/watchlist" className="block mt-4 text-center text-primary hover:underline">
        View All →
      </Link>
    </div>
  )
}

export default WatchlistWidget