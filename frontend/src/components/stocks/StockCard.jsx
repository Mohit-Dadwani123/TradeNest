import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatPercentage, getChangeColor, getChangeIcon } from '../../utils/helpers'

const StockCard = ({ stock, showWatchlistButton = false, onWatchlistToggle, isInWatchlist }) => {
  const changeColor = getChangeColor(stock.change)
  const changeIcon = getChangeIcon(stock.change)

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      <Link to={`/stock/${stock.symbol}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{stock.symbol}</h3>
            <p className="text-sm text-gray-600">{stock.name}</p>
          </div>
          {showWatchlistButton && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onWatchlistToggle(stock._id)
              }}
              className={`text-2xl ${isInWatchlist ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition`}
            >
              ★
            </button>
          )}
        </div>
        
        <div className="mt-3">
          <div className="text-2xl font-bold">{formatCurrency(stock.price)}</div>
          <div className={`${changeColor} flex items-center gap-1 mt-1`}>
            <span>{changeIcon}</span>
            <span>{formatCurrency(Math.abs(stock.change))}</span>
            <span>({formatPercentage(stock.changePercent)})</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Volume</span>
            <div className="font-semibold">{stock.volume?.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-500">Market Cap</span>
            <div className="font-semibold">{stock.marketCap?.toLocaleString()}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default StockCard