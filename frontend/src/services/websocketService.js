import io from 'socket.io-client'

class WebSocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    if (this.socket?.connected) return
    
    this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      }
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.emit('connected', { userId: this.socket.id })
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    // Handle different event types
    this.socket.on('priceUpdate', (data) => {
      this.notifyListeners('priceUpdate', data)
    })

    this.socket.on('trade', (data) => {
      this.notifyListeners('trade', data)
    })

    this.socket.on('orderUpdate', (data) => {
      this.notifyListeners('orderUpdate', data)
    })

    this.socket.on('portfolioUpdate', (data) => {
      this.notifyListeners('portfolioUpdate', data)
    })

    this.socket.on('notification', (data) => {
      this.notifyListeners('notification', data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  subscribe(symbols) {
    if (this.socket?.connected) {
      this.socket.emit('subscribe', { symbols: Array.isArray(symbols) ? symbols : [symbols] })
    }
  }

  unsubscribe(symbols) {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe', { symbols: Array.isArray(symbols) ? symbols : [symbols] })
    }
  }

  placeOrder(orderData) {
    if (this.socket?.connected) {
      this.socket.emit('placeOrder', orderData)
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback)
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data))
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export default new WebSocketService()