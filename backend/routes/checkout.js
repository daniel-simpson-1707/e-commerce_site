const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const paypal = require('paypal-rest-sdk');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Configure PayPal SDK
paypal.configure({
  mode: 'sandbox', // or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Create Stripe Checkout Session
router.post('/stripe', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sample Product'
          },
          unit_amount: 5000
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: process.env.SUCCESS_URL || 'http://localhost:3000/success',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:3000/cancel'
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create PayPal Order
router.post('/paypal', async (req, res) => {
  const create_payment_json = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '50.00'
      }
    }],
    application_context: {
      return_url: process.env.SUCCESS_URL || 'http://localhost:3000/success',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:3000/cancel'
    }
  };

  paypal.order.create(create_payment_json, (error, order) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ id: order.id });
  });
});

// Create PaymentIntent for Card
router.post('/card', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: req.user.sub }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
