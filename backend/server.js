require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CORS: allow Vercel frontend + local dev
const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = 'https://api.paystack.co';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BuySmart API' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'BuySmart API is running',
    endpoints: {
      health: '/api/health',
      paystackInitialize: 'POST /api/paystack/initialize',
      paystackVerify: 'GET /api/paystack/verify?reference=xxx',
    },
  });
});

// Initialize Paystack transaction
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, metadata, callback_url } = req.body;
    const payload = {
      email,
      amount: amount * 100, // Paystack expects kobo
      metadata,
      callback_url: callback_url || `${process.env.CLIENT_URL?.replace(/\/$/, '')}/invoice`,
    };

    const response = await axios.post(
      `${PAYSTACK_BASE}/transaction/initialize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Paystack init error:', err.response?.data || err.message);
    res.status(500).json({
      message: err.response?.data?.message || 'Payment initialization failed',
    });
  }
});

// Verify Paystack transaction
app.get('/api/paystack/verify', async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ message: 'Reference required' });

    const response = await axios.get(
      `${PAYSTACK_BASE}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Paystack verify error:', err.response?.data || err.message);
    res.status(500).json({
      message: err.response?.data?.message || 'Verification failed',
    });
  }
});

// Only start the server locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`BuySmart backend running on port ${PORT}`);
  });
}

module.exports = app;
