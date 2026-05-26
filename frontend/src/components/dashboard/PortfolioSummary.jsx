import React from 'react'
import { formatCurrency, formatPercentage, calculatePortfolioSummary } from '../../utils/helpers'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const PortfolioSummary = ({ holdings }) => {
  const summary = calculatePortfolioSummary(holdings)
  
  // Prepare data for pie chart
  const pieData = holdings.map(holding => ({
    name: holding.symbol,
    value: holding.currentPrice * holding.quantity
  }))
  
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow border">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Portfolio Summary</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Investment</span>
              <span className="font-semibold">{formatCurrency(summary.totalInvestment)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Current Value</span>
              <span className="font-semibold">{formatCurrency(summary.totalCurrentValue)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total P&L</span>
              <span className={`font-semibold ${summary.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.totalPL)} ({formatPercentage(summary.totalPLPercentage)})
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Holdings</span>
              <span className="font-semibold">{summary.totalHoldings}</span>
            </div>
          </div>
        </div>
        
        <div>
          {pieData.length > 0 && (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold mb-3">Holdings Details</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {holdings.map((holding, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <span className="font-semibold">{holding.symbol}</span>
                <span className="text-gray-500 text-sm ml-2">{holding.quantity} shares</span>
              </div>
              <div className="text-right">
                <div>{formatCurrency(holding.currentPrice * holding.quantity)}</div>
                <div className={`text-sm ${holding.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(holding.pl)} ({formatPercentage(holding.plPercentage)})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary