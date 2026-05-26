import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import toast from 'react-hot-toast'

export const useWebSocket = (symbols = []) => {
  const [livePrices, setLivePrices] = useState({})
  const socketRef = useRef(null)

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      transports: ['websocket']
    })

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected')
      if (symbols.length > 0) {
        socketRef.current.emit('subscribe', { symbols })
      }
    })

    socketRef.current.on('priceUpdate', (data) => {
      setLivePrices(prev => ({
        ...prev,
        [data.symbol]: data
      }))
    })

    socketRef.current.on('trade', (data) => {
      // Handle trade notifications
      if (data.type === 'order_filled') {
        toast.success(`Order filled: ${data.quantity} shares of ${data.symbol}`)
      }
    })

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    socketRef.current.on('error', (error) => {
      console.error('WebSocket error:', error)
      toast.error('Connection error')
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const subscribe = (newSymbols) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('subscribe', { symbols: newSymbols })
    }
  }

  const unsubscribe = (symbols) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('unsubscribe', { symbols })
    }
  }

  return { livePrices, subscribe, unsubscribe, socket: socketRef.current }
}