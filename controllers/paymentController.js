const paymongoClient = require('../config/paymongo');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Create PayMongo Checkout Session
// @route   POST /api/payment/checkout
// @access  Private
const createCheckout = async (req, res) => {
  try {
    const response = await paymongoClient.post('/checkout_sessions', {
      data: {
        attributes: {
          billing: {
            email: req.user.email
          },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: 'Unlock All Premium Themes - MindFlip',
          line_items: [{
            currency: 'PHP',
            amount: parseInt(process.env.PAYMONGO_PRICE_AMOUNT) || 24900, // Amount in centavos (₱249.00)
            name: 'Premium Themes Bundle',
            quantity: 1
          }],
          payment_method_types: ['gcash', 'grab_pay', 'paymaya', 'card'],
          success_url: `${process.env.CLIENT_URL}/success`,
          cancel_url: `${process.env.CLIENT_URL}/cancel`,
          metadata: {
            userId: req.user._id.toString()
          }
        }
      }
    });

    const checkoutUrl = response.data.data.attributes.checkout_url;
    
    res.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Create checkout error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error creating checkout session.' 
    });
  }
};

// @desc    Verify PayMongo webhook signature
// @param   {string} payload - Raw request body
// @param   {string} signatureHeader - Paymongo-Signature header value
// @returns {boolean} - Whether signature is valid
const verifyWebhookSignature = (payload, signatureHeader) => {
  try {
    if (!signatureHeader || !process.env.PAYMONGO_WEBHOOK_SECRET) {
      console.warn('Missing signature or webhook secret');
      return false;
    }

    // PayMongo signature format: t=timestamp,te=test_signature,li=live_signature
    const parts = signatureHeader.split(',');
    const timestampPart = parts.find(p => p.startsWith('t='));
    const signaturePart = parts.find(p => p.startsWith('te=') || p.startsWith('li='));

    if (!timestampPart || !signaturePart) {
      console.warn('Invalid signature format');
      return false;
    }

    const timestamp = timestampPart.split('=')[1];
    const signature = signaturePart.split('=')[1];

    // Create the signed payload
    const signedPayload = `${timestamp}.${payload}`;

    // Compute HMAC
    const expectedSignature = crypto
      .createHmac('sha256', process.env.PAYMONGO_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// @desc    Handle PayMongo Webhook
// @route   POST /api/payment/webhook
// @access  Public (PayMongo only)
const handleWebhook = async (req, res) => {
  const signatureHeader = req.headers['paymongo-signature'];
  const payload = req.body.toString();

  // Verify signature (optional in development, required in production)
  if (process.env.NODE_ENV === 'production') {
    const isValid = verifyWebhookSignature(payload, signatureHeader);
    if (!isValid) {
      console.error('Webhook signature verification failed');
      return res.status(400).json({ 
        message: 'Webhook signature verification failed' 
      });
    }
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (error) {
    console.error('Invalid JSON payload:', error.message);
    return res.status(400).json({ message: 'Invalid JSON' });
  }

  // Handle the event
  const eventType = event.data?.attributes?.type;
  
  if (eventType === 'checkout_session.payment.paid') {
    try {
      const checkoutSession = event.data.attributes.data;
      const userId = checkoutSession?.attributes?.metadata?.userId;
      
      if (userId) {
        // Update user to premium
        await User.findByIdAndUpdate(userId, { isPremium: true });
        console.log(`User ${userId} upgraded to premium via PayMongo`);
      } else {
        console.error('No userId in checkout session metadata');
      }
    } catch (error) {
      console.error('Error updating user to premium:', error);
    }
  } else {
    console.log(`Received event type: ${eventType || 'unknown'}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

module.exports = {
  createCheckout,
  handleWebhook
};
