// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format percentage
export const formatPercentage = (value) => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

// Format large numbers (K, M, B)
export const formatLargeNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toString()
}

// Format date
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes)
}

// Calculate profit/loss
export const calculatePL = (buyPrice, currentPrice, quantity) => {
  const totalBuy = buyPrice * quantity
  const totalCurrent = currentPrice * quantity
  const pl = totalCurrent - totalBuy
  const plPercentage = (pl / totalBuy) * 100
  return { pl, plPercentage }
}

// Calculate portfolio summary
export const calculatePortfolioSummary = (holdings) => {
  let totalInvestment = 0
  let totalCurrentValue = 0
  
  holdings.forEach(holding => {
    totalInvestment += holding.buyPrice * holding.quantity
    totalCurrentValue += holding.currentPrice * holding.quantity
  })
  
  const totalPL = totalCurrentValue - totalInvestment
  const totalPLPercentage = (totalPL / totalInvestment) * 100
  
  return {
    totalInvestment,
    totalCurrentValue,
    totalPL,
    totalPLPercentage,
    totalHoldings: holdings.length
  }
}

// Debounce function for search
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Get color based on change
export const getChangeColor = (change) => {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-600'
}

// Get icon based on change
export const getChangeIcon = (change) => {
  if (change > 0) return '▲'
  if (change < 0) return '▼'
  return '●'
}

// Validate and parse stock data
export const parseStockData = (data) => {
  return {
    symbol: data.symbol,
    name: data.name,
    price: parseFloat(data.price),
    change: parseFloat(data.change),
    changePercent: parseFloat(data.changePercent),
    volume: parseInt(data.volume),
    marketCap: data.marketCap,
    peRatio: data.peRatio,
    dividend: data.dividend
  }
}

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) result[groupKey] = []
    result[groupKey].push(item)
    return result
  }, {})
}

// Sort stocks by various criteria
export const sortStocks = (stocks, criteria, order = 'asc') => {
  const sorted = [...stocks]
  sorted.sort((a, b) => {
    let aVal = a[criteria]
    let bVal = b[criteria]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  return sorted
}

// Check if market is open (Indian market hours: 9:15 AM - 3:30 PM, Mon-Fri)
export const isMarketOpen = () => {
  const now = new Date()
  const day = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  
  if (day === 0 || day === 6) return false // Weekend
  
  const currentTime = hours + minutes / 60
  return currentTime >= 9.25 && currentTime <= 15.5
}

// Download data as CSV
export const downloadCSV = (data, filename) => {
  const csv = convertToCSV(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const convertToCSV = (data) => {
  if (!data.length) return ''
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]
  
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header]
      return `"${String(val).replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}