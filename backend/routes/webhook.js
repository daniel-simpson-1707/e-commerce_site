const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Webhook Handler
router.post('/stripe', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('PaymentIntent succeeded:', paymentIntent.id);
    // TODO: Record order in DB
  } else if (event.type === 'payment_intent.payment_failed') {
    console.log('PaymentIntent failed:', event.data.object.id);
  }

  res.json({ received: true });
});

// PayPal Webhook Handler (IPN/Webhook)
router.post('/paypal', (req, res) => {
  // TODO: Validate against PayPal API
  console.log('PayPal webhook received:', req.body);
  res.sendStatus(200);
});

module.exports = router;
