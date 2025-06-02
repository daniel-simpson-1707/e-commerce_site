# Example Site with Payment Portal

## Overview
This is a full-stack example project demonstrating:
- React + TypeScript + TailwindCSS frontend
- Node.js + Express backend
- Auth0 authentication integration
- Stripe (Checkout & Card) and PayPal payment integrations
- Webhook handlers for Stripe and PayPal
- Dockerized development and local deployment setup

## Prerequisites
- Node.js (v14+)
- Docker & Docker Compose
- Auth0 account (for authentication)
- Stripe account (for payment processing)
- PayPal Developer account (for sandbox testing)

## Repository Structure
```
example-site/
├── README.md
├── .env.example
├── docker-compose.yml
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── auth.js
│   ├── index.js
│   └── routes/
│       ├── checkout.js
│       └── webhook.js
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── public/
    │   └── index.html
    └── src/
        ├── index.tsx
        ├── App.tsx
        ├── react-app-env.d.ts
        ├── hooks/
        │   └── useAuth.ts
        ├── components/
        │   └── Header.tsx
        └── pages/
            ├── Login.tsx
            ├── Checkout.tsx
            ├── Success.tsx
            └── Cancel.tsx
```

### Frontend
- **Frameworks & Libraries**: React, TypeScript, TailwindCSS.
- **Auth**: Auth0, using `@auth0/auth0-react` for login and JWT token management.
- **Payments**:
  - **Stripe Checkout**: Redirect-based payment for a sample product.
  - **Stripe Card Payment**: Direct card entry via Stripe Elements.
  - **PayPal Checkout**: Redirect-based PayPal payment flow.
- **Routes**:
  - `/` - Landing page
  - `/login` - Auth0 login
  - `/checkout` - Choose payment method (Stripe Checkout, Stripe Card, or PayPal)
  - `/success` - Payment success confirmation
  - `/cancel` - Payment cancellation notice

### Backend
- **Frameworks & Libraries**: Express, Stripe SDK, PayPal REST SDK, Auth0 JWT validation via `express-jwt` and `jwks-rsa`.
- **Routes**:
  - `POST /api/checkout/stripe` - Create a Stripe Checkout Session.
  - `POST /api/checkout/card` - Create a Stripe PaymentIntent for direct card payment.
  - `POST /api/checkout/paypal` - Create a PayPal order for Checkout.
  - `POST /api/webhook/stripe` - Stripe webhook listener (handles `payment_intent.succeeded` and `payment_intent.payment_failed`).
  - `POST /api/webhook/paypal` - PayPal webhook listener (IPN/Webhook validation placeholder).
- **Auth**: JWT middleware (`auth.js`) protects `/api/checkout` routes and validates tokens issued by Auth0.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd example-site
   ```

2. **Environment Configuration**
   - Copy root `.env.example` to `.env` and update values:
     ```bash
     cp .env.example .env
     ```
   - Copy frontend `.env.example` to `frontend/.env` and update:
     ```bash
     cp frontend/.env.example frontend/.env
     ```
   - Copy backend `.env.example` to `backend/.env` and update:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Populate all Auth0, Stripe, and PayPal credentials.

3. **Dockerized Development**
   - Build and run both services together:
     ```bash
     docker-compose up --build
     ```
   - Access:
     - Frontend: http://localhost:3000
     - Backend: http://localhost:4000

4. **Local Development (Without Docker)**
   - **Frontend**
     ```bash
     cd frontend
     npm install
     npm run start
     ```
   - **Backend**
     ```bash
     cd backend
     npm install
     npm run dev
     ```

5. **Testing Payment Flows**
   - **Stripe Checkout**: Click “Pay with Stripe Checkout” on `/checkout`.
   - **Stripe Card**: Enter test card details (e.g., 4242 4242 4242 4242, any valid expiry, CVC) and submit.
   - **PayPal**: Click “Pay with PayPal” to open sandbox PayPal checkout.

6. **Webhooks**
   - **Stripe**: Point your Stripe Dashboard webhook endpoint to `http://<your-server>/api/webhook/stripe` with correct signing secret.
   - **PayPal**: Configure IPN/Webhook to `http://<your-server>/api/webhook/paypal` and update `PAYPAL_WEBHOOK_ID`.

## Notes
- Current implementation uses an in-memory mock for order fulfillment. To integrate a real database, update the webhook handlers in `backend/routes/webhook.js`.
- Make sure environment variables like `SUCCESS_URL` and `CANCEL_URL` are set to match your frontend routes (e.g., `http://localhost:3000/success` & `http://localhost:3000/cancel`).
- For production, replace sandbox/test keys with live API keys, and secure environment management accordingly.
