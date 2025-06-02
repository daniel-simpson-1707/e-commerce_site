require('dotenv').config();
const express = require('express');
const cors = require('cors');
const checkJwt = require('./auth');
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhook');

const app = express();
app.use(cors());
app.use(express.json());

// Protected routes
app.use('/api/checkout', checkJwt, checkoutRoutes);

// Public webhook endpoints
app.use('/api/webhook', webhookRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Example Backend Running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
