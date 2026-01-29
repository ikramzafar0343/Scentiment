# Payment API Documentation

This document describes the backend API endpoints required for the payment integration.

## Base URL

All endpoints are prefixed with `/api` (configurable via `VITE_API_BASE_URL`).

## Authentication

All endpoints require authentication. Include authentication tokens in cookies or headers as per your authentication system.

## Endpoints

### 1. Create Payment Intent

**POST** `/api/payment-intents`

Creates a new payment intent for processing a payment.

**Request Body:**
```json
{
  "amount": 5000,  // Amount in cents (e.g., 5000 = €50.00)
  "currency": "eur",
  "customerId": "cus_xxx",  // Optional: existing customer ID
  "metadata": {  // Optional: additional metadata
    "itemCount": "3",
    "orderReference": "SC-ABC123"
  }
}
```

**Response:**
```json
{
  "paymentIntent": {
    "id": "pi_xxx",
    "clientSecret": "pi_xxx_secret_xxx",
    "status": "requires_payment_method"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request
- `401` - Unauthorized
- `500` - Server error

---

### 2. Confirm Payment Intent

**POST** `/api/payment-intents/:id/confirm`

Confirms a payment intent with a payment method.

**Request Body:**
```json
{
  "paymentMethodId": "pm_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_xxx"  // Optional: your internal order ID
}
```

**Status Codes:**
- `200` - Payment confirmed
- `400` - Invalid payment method or intent
- `402` - Payment failed (card declined, etc.)
- `401` - Unauthorized
- `500` - Server error

---

### 3. Get Payment Methods

**GET** `/api/payment-methods`

Retrieves all saved payment methods for the current customer.

**Response:**
```json
{
  "paymentMethods": [
    {
      "id": "pm_xxx",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025,
        "name": "John Doe"
      },
      "isDefault": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### 4. Attach Payment Method

**POST** `/api/payment-methods/attach`

Attaches a payment method to the current customer for future use.

**Request Body:**
```json
{
  "paymentMethodId": "pm_xxx",
  "setAsDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "paymentMethodId": "pm_xxx"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid payment method
- `401` - Unauthorized
- `500` - Server error

---

### 5. Detach Payment Method

**DELETE** `/api/payment-methods/:id`

Removes a payment method from the customer.

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `400` - Cannot detach (e.g., last payment method)
- `401` - Unauthorized
- `404` - Payment method not found
- `500` - Server error

---

### 6. Set Default Payment Method

**PATCH** `/api/payment-methods/:id/default`

Sets a payment method as the default for the customer.

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Payment method not found
- `500` - Server error

---

## Webhooks

Your backend should handle Stripe webhooks for the following events:

### Payment Success
- **Event:** `payment_intent.succeeded`
- **Action:** Update order status, send confirmation email, fulfill order

### Payment Failure
- **Event:** `payment_intent.payment_failed`
- **Action:** Log failure, notify customer, update order status

### Refund (Optional)
- **Event:** `charge.refunded`
- **Action:** Update order status, process refund in your system

### Webhook Endpoint
**POST** `/api/webhooks/stripe`

**Headers:**
- `Stripe-Signature`: Stripe webhook signature for verification

**Security:**
- Always verify webhook signatures using Stripe's webhook secret
- Use idempotency keys to prevent duplicate processing

---

## Security Best Practices

1. **Never store raw card data** - Only store payment method IDs
2. **Use HTTPS** - All API calls must be over HTTPS
3. **Validate amounts** - Always validate payment amounts on the backend
4. **Verify webhooks** - Always verify Stripe webhook signatures
5. **PCI Compliance** - Ensure your backend follows PCI-DSS guidelines
6. **Rate limiting** - Implement rate limiting on payment endpoints
7. **Logging** - Log all payment operations (without sensitive data)
8. **Error handling** - Never expose sensitive error details to frontend

---

## Environment Variables

Required environment variables for the frontend:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # Stripe publishable key
VITE_API_BASE_URL=https://api.yoursite.com  # Optional: API base URL
```

---

## Example Backend Implementation (Node.js/Express)

```javascript
// Example using Stripe Node.js SDK
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
app.post('/api/payment-intents', async (req, res) => {
  try {
    const { amount, currency = 'eur', customerId, metadata } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata,
    });
    
    res.json({
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment intent
app.post('/api/payment-intents/:id/confirm', async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const { id } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.confirm(id, {
      payment_method: paymentMethodId,
    });
    
    if (paymentIntent.status === 'succeeded') {
      // Create order in your database
      const order = await createOrder(paymentIntent);
      
      res.json({
        success: true,
        orderId: order.id,
      });
    } else {
      res.status(402).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## Testing

For testing, use Stripe test mode:
- Test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVV: Any 3 digits
- Use test API keys (prefix: `pk_test_`)

---

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Security Guide](https://stripe.com/docs/security)
