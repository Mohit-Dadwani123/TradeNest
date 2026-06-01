const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stock = require('../models/Stock');

dotenv.config();

// Sample stock data for seeding
const stocks = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE',
    sector: 'Energy',
    industry: 'Oil & Gas',
    price: 2456.75,
    open: 2410.50,
    high: 2470.00,
    low: 2405.00,
    previousClose: 2411.45,
    change: 45.30,
    changePercent: 1.88,
    volume: 5234567,
    marketCap: 1660000000000,
    peRatio: 24.5,
    dividendYield: 0.35,
    eps: 100.25,
    week52High: 2600.00,
    week52Low: 2100.00
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    exchange: 'NSE',
    sector: 'Technology',
    industry: 'IT Services',
    price: 3567.80,
    open: 3590.00,
    high: 3600.00,
    low: 3550.00,
    previousClose: 3591.25,
    change: -23.45,
    changePercent: -0.65,
    volume: 1234567,
    marketCap: 1300000000000,
    peRatio: 28.5,
    dividendYield: 1.2,
    eps: 125.00,
    week52High: 3800.00,
    week52Low: 3100.00
  },
  {
    symbol: 'HDFC',
    name: 'HDFC Bank Ltd',
    exchange: 'NSE',
    sector: 'Financial',
    industry: 'Banking',
    price: 1678.90,
    open: 1665.00,
    high: 1690.00,
    low: 1660.00,
    previousClose: 1666.55,
    change: 12.35,
    changePercent: 0.74,
    volume: 3456789,
    marketCap: 900000000000,
    peRatio: 20.5,
    dividendYield: 0.9,
    eps: 82.00,
    week52High: 1800.00,
    week52Low: 1400.00
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    exchange: 'NSE',
    sector: 'Technology',
    industry: 'IT Services',
    price: 1567.25,
    open: 1545.00,
    high: 1580.00,
    low: 1540.00,
    previousClose: 1544.10,
    change: 23.15,
    changePercent: 1.50,
    volume: 2345678,
    marketCap: 650000000000,
    peRatio: 26.5,
    dividendYield: 1.5,
    eps: 59.00,
    week52High: 1650.00,
    week52Low: 1200.00
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    exchange: 'NSE',
    sector: 'Technology',
    industry: 'IT Services',
    price: 456.30,
    open: 460.00,
    high: 462.00,
    low: 455.00,
    previousClose: 458.90,
    change: -2.60,
    changePercent: -0.57,
    volume: 4567890,
    marketCap: 250000000000,
    peRatio: 22.5,
    dividendYield: 1.8,
    eps: 20.30,
    week52High: 500.00,
    week52Low: 380.00
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing stocks
    await Stock.deleteMany();
    console.log('Existing stocks deleted');
    
    // Insert new stocks
    await Stock.insertMany(stocks);
    console.log(`${stocks.length} stocks inserted successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();