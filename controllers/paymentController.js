const stripe = require('../config/stripe');
const User = require('../models/User');

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/checkout
// @access  Private
const createCheckout = async (req, res) => {
  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId: req.user._id.toString()
      }
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ 
      message: 'Error creating checkout session.' 
    });
  }
};

// @desc    Handle Stripe Webhook
// @route   POST /api/payment/webhook
// @access  Public (Stripe only)
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ 
      message: `Webhook Error: ${error.message}` 
    });
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Get user ID from session metadata
        const userId = session.metadata.userId;
        
        if (userId) {
          // Update user to premium
          await User.findByIdAndUpdate(userId, { isPremium: true });
          console.log(`User ${userId} upgraded to premium`);
        } else {
          console.error('No userId in session metadata');
        }
      } catch (error) {
        console.error('Error updating user to premium:', error);
      }
      break;
      
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful!');
      break;
      
    case 'payment_intent.payment_failed':
      console.log('PaymentIntent failed.');
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

module.exports = {
  createCheckout,
  handleWebhook
};
