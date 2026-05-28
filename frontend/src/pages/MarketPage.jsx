import React from 'react'

const MarketPage = () => {
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 45.30, changePercent: 1.88 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3567.80, change: -23.45, changePercent: -0.65 },
    { symbol: 'HDFC', name: 'HDFC Bank', price: 1678.90, change: 12.34, changePercent: 0.74 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Market</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Symbol</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="border-t">
                <td className="px-6 py-4 font-semibold">{stock.symbol}</td>
                <td className="px-6 py-4">{stock.name}</td>
                <td className="px-6 py-4 text-right">₹{stock.price.toFixed(2)}</td>
                <td className={`px-6 py-4 text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MarketPage