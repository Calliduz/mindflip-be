# MindFlip Memory Card Game - Backend

A MERN stack backend for the Memory Card Game with Paywall Themes.

## Tech Stack

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Stripe** - Payment processing

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindflip
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_stripe_price_id
CLIENT_URL=http://localhost:5173
```

## MongoDB Atlas Production Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account or sign in
3. Create a new project (e.g., "MindFlip")

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "mindflip-cluster")
5. Click "Create Cluster"

### 3. Configure Database Access
1. Go to **Database Access** in the sidebar
2. Click "Add New Database User"
3. Create a user with password authentication
4. Save the username and password securely

### 4. Configure Network Access
1. Go to **Network Access** in the sidebar
2. Click "Add IP Address"
3. For development: Add your current IP
4. For production: Add `0.0.0.0/0` (allows all IPs) or your server's IP

### 5. Get Connection String
1. Go to your cluster and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user's password
5. Replace `myFirstDatabase` with `mindflip`

Example connection string:
```
mongodb+srv://username:password@mindflip-cluster.xxxxx.mongodb.net/mindflip?retryWrites=true&w=majority
```

### 6. Update Your .env
```env
MONGODB_URI=mongodb+srv://username:password@mindflip-cluster.xxxxx.mongodb.net/mindflip?retryWrites=true&w=majority
```

## Database Scripts

```bash
# Seed database with test users
npm run seed

# Create production indexes (run after deploying to production)
npm run migrate

# Reset database (WARNING: deletes all data)
npm run reset
```

### Test Accounts (after seeding)
- **Free user**: test@example.com / password123
- **Premium user**: premium@example.com / password123

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/user/me` | Get current user | Yes |

### Themes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/themes/list` | Get all themes | No (but checks premium status if authenticated) |
| GET | `/api/themes/premium` | Get premium themes | Yes + Premium |

### Payments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payment/checkout` | Create Stripe checkout | Yes |
| POST | `/api/payment/webhook` | Stripe webhook | No (Stripe only) |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## Stripe Setup

### 1. Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create an account or sign in

### 2. Get API Keys
1. Go to Developers > API Keys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Add to `.env` as `STRIPE_SECRET_KEY`

### 3. Create a Product & Price
1. Go to Products > Add Product
2. Name: "Unlock All Themes"
3. Price: $4.99 (one-time)
4. Copy the Price ID (starts with `price_`)
5. Add to `.env` as `STRIPE_PRICE_ID`

### 4. Setup Webhooks (Local Development)
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payment/webhook

# Copy the webhook signing secret (whsec_...) to your .env
```

### 5. Setup Webhooks (Production)
1. Go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/payment/webhook`
3. Select events: `checkout.session.completed`
4. Copy signing secret to your production environment

## Project Structure

```
mindflip-be/
├── config/
│   └── stripe.js          # Stripe client initialization
├── controllers/
│   ├── authController.js   # Auth logic (register, login, getMe)
│   ├── themeController.js  # Theme listing logic
│   └── paymentController.js # Stripe checkout & webhooks
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   └── requirePremium.js   # Premium user check
├── models/
│   └── User.js             # User schema with bcrypt
├── routes/
│   ├── authRoutes.js
│   ├── themeRoutes.js
│   └── paymentRoutes.js
├── scripts/
│   ├── seed.js             # Database seeding
│   ├── migrate.js          # Production indexes
│   └── reset.js            # Database reset
├── .env.example
├── package.json
├── README.md
└── server.js               # App entry point
```

## Deployment

### Deploy to Render.com (Free)

1. Push code to GitHub
2. Go to [Render](https://render.com) and create account
3. Create a new Web Service
4. Connect your GitHub repo
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables
7. Deploy!

### Deploy to Railway

1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project from GitHub
4. Add environment variables
5. Deploy!

## License

ISC
