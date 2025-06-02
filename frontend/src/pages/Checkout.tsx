import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const CreditCardForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { getAccessTokenSilently } = useAuth();
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStatus('Processing payment...');
    const token = await getAccessTokenSilently();
    const { data } = await axios.post(
      '/api/checkout/card',
      { amount: 5000, currency: 'usd' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const clientSecret = data.clientSecret;
    const cardElement = elements.getElement(CardElement)!;
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setStatus(`Payment failed: ${error.message}`);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setStatus('Payment succeeded! Redirecting...');
      window.location.href = '/success';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <CardElement options={{ hidePostalCode: false, style: { base: { fontSize: '16px' } } }} />
      <button type="submit" disabled={!stripe} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Pay $50.00
      </button>
      {status && <p className="mt-2 text-gray-700">{status}</p>}
    </form>
  );
};

const Checkout: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth();

  if (!isAuthenticated) {
    loginWithRedirect();
    return <div>Redirecting to login...</div>;
  }

  const handleStripeCheckout = async () => {
    const token = await getAccessTokenSilently();
    const { data } = await axios.post('/api/checkout/stripe', {}, { headers: { Authorization: `Bearer ${token}` } });
    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  const handlePayPalCheckout = async () => {
    const token = await getAccessTokenSilently();
    const { data } = await axios.post('/api/checkout/paypal', {}, { headers: { Authorization: `Bearer ${token}` } });
    window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl mb-4">Choose Payment Method</h2>
      <button onClick={handleStripeCheckout} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded">
        Pay with Stripe Checkout
      </button>
      <button onClick={handlePayPalCheckout} className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded">
        Pay with PayPal
      </button>
      <Elements stripe={stripePromise}>
        <CreditCardForm />
      </Elements>
    </div>
  );
};

export default Checkout;
