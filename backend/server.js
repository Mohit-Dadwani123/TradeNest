const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const stockRoutes = require('./src/routes/stockRoutes');
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const watchlistRoutes = require('./src/routes/watchlistRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const marketRoutes = require('./src/routes/marketRoutes');

// Import middleware
const { errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/market', marketRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  // Join user room for private messages
  socket.on('authenticate', (token) => {
    // Verify JWT and join user room
    socket.join(`user_${socket.id}`);
  });
  
  // Subscribe to stock updates
  socket.on('subscribe', (data) => {
    const { symbols } = data;
    symbols.forEach(symbol => {
      socket.join(`stock_${symbol}`);
    });
    console.log(`Client ${socket.id} subscribed to: ${symbols.join(', ')}`);
  });
  
  // Unsubscribe from stock updates
  socket.on('unsubscribe', (data) => {
    const { symbols } = data;
    symbols.forEach(symbol => {
      socket.leave(`stock_${symbol}`);
    });
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Real-time price updates simulation (replace with actual API)
setInterval(() => {
  const stocks = ['RELIANCE', 'TCS', 'HDFC', 'INFY', 'WIPRO'];
  stocks.forEach(symbol => {
    const priceUpdate = {
      symbol,
      price: Math.random() * 5000,
      change: (Math.random() - 0.5) * 100,
      timestamp: new Date()
    };
    io.to(`stock_${symbol}`).emit('priceUpdate', priceUpdate);
  });
}, 5000);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});