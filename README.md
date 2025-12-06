# MindFlip Backend

Backend API for MindFlip Memory Card Game with Premium Themes using PayMongo payments.

## Tech Stack

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **PayMongo** - Philippines payment gateway (GCash, GrabPay, Maya, Cards)

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required environment variables:**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PAYMONGO_SECRET_KEY` | Your PayMongo secret key |
| `PAYMONGO_WEBHOOK_SECRET` | Webhook signature secret |
| `PAYMONGO_PRICE_AMOUNT` | Price in centavos (24900 = ₱249.00) |
| `CLIENT_URL` | Frontend URL for redirects |

### 3. Get PayMongo API Keys

1. Go to [PayMongo Dashboard](https://dashboard.paymongo.com/developers)
2. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)
3. Create a webhook endpoint and copy the **Webhook Secret**

### 4. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 5. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/user/me` | Get current user profile | Required |

### Themes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/themes/list` | Get all themes with lock status | Optional |
| GET | `/api/themes/premium` | Get premium themes | Premium Required |

### Payments (PayMongo)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payment/checkout` | Create checkout session | Required |
| POST | `/api/payment/webhook` | Handle PayMongo webhooks | Public (PayMongo only) |

## Available Payment Methods

PayMongo supports the following payment methods in the Philippines:

- **GCash** - Popular e-wallet
- **GrabPay** - Grab's payment service
- **Maya** (PayMaya) - Digital wallet
- **Credit/Debit Cards** - Visa, Mastercard

## Testing Webhooks Locally

Use ngrok to expose your local server for webhook testing:

```bash
# Install ngrok from https://ngrok.com/download

# Start your server
npm run dev

# In another terminal, expose port 5000
ngrok http 5000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Add webhook endpoint in PayMongo Dashboard:
# https://abc123.ngrok.io/api/payment/webhook

# Select events: checkout_session.payment.paid
```

## Frontend Proxy Configuration

The React frontend (Vite) proxies API requests to this backend:

```javascript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

## Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with test data
npm run reset    # Reset database
npm run migrate  # Run migrations
```

## Project Structure

```
mindflip-be/
├── config/
│   └── paymongo.js       # PayMongo API client
├── controllers/
│   ├── authController.js
│   ├── themeController.js
│   └── paymentController.js
├── middleware/
│   ├── authMiddleware.js
│   └── requirePremium.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── themeRoutes.js
│   └── paymentRoutes.js
├── scripts/
│   ├── seed.js
│   ├── reset.js
│   └── migrate.js
├── server.js
├── .env.example
└── package.json
```

## License

ISC
