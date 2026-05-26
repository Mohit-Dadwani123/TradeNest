import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts'
import { CHART_TIMEFRAMES, CHART_INTERVALS } from '../../utils/constants'
import { formatCurrency } from '../../utils/helpers'

const StockChart = ({ data, type = 'line', height = 400 }) => {
  const [chartType, setChartType] = useState(type)
  const [timeframe, setTimeframe] = useState('1M')
  const [filteredData, setFilteredData] = useState(data)

  useEffect(() => {
    // Filter data based on timeframe
    if (data && data.length > 0) {
      const now = new Date()
      let startDate = new Date()
      
      switch(timeframe) {
        case '1D':
          startDate.setDate(now.getDate() - 1)
          break
        case '1W':
          startDate.setDate(now.getDate() - 7)
          break
        case '1M':
          startDate.setMonth(now.getMonth() - 1)
          break
        case '3M':
          startDate.setMonth(now.getMonth() - 3)
          break
        case '6M':
          startDate.setMonth(now.getMonth() - 6)
          break
        case '1Y':
          startDate.setFullYear(now.getFullYear() - 1)
          break
        default:
          startDate.setMonth(now.getMonth() - 1)
      }
      
      const filtered = data.filter(item => new Date(item.date) >= startDate)
      setFilteredData(filtered)
    }
  }, [data, timeframe])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">Price: {formatCurrency(payload[0].value)}</p>
          {payload[0].payload.volume && (
            <p className="text-gray-600">Volume: {payload[0].payload.volume.toLocaleString()}</p>
          )}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      height: height,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    }

    switch(chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                fill="#2563eb" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      
      case 'candle':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="volume" 
                fill="#8884d8" 
                opacity={0.3} 
                yAxisId="volume" 
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        )
      
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded ${chartType === 'line' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded ${chartType === 'area' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('candle')}
            className={`px-3 py-1 rounded ${chartType === 'candle' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Candle
          </button>
        </div>
        
        <div className="flex gap-2">
          {Object.keys(CHART_TIMEFRAMES).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded ${timeframe === tf ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {renderChart()}
    </div>
  )
}

export default StockChart