import { useContext } from 'react'
import { StockContext } from '../context/StockContext'

export const useStockData = () => {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error('useStockData must be used within StockProvider')
  }
  return context
}