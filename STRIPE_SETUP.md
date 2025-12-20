# Stripe Payment Integration Setup Guide

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Stripe Keys (Get these from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe Secret Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe Publishable Key

# Stripe Webhook Secret (Get this from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...  # Your Stripe Webhook Secret
```

## Steps to Get Stripe Keys

1. **Create a Stripe Account** (if you don't have one):
   - Go to https://stripe.com
   - Sign up for an account

2. **Get API Keys**:
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Add them to your `.env.local` file

3. **Set up Webhook**:
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Set the endpoint URL to: `https://yourdomain.com/api/payments/webhook`
   - Select events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)
   - Add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`

## Database Migration

After adding the Order and Payment models, run:

```bash
npx prisma migrate dev --name add_order_and_payment_models
```

Or if you prefer to push without creating a migration:

```bash
npx prisma db push
```

## Testing

### Test Cards

Use these test card numbers in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Testing Flow

1. Add items to cart
2. Go to checkout page
3. Fill in billing details
4. Use test card: `4242 4242 4242 4242`
5. Complete payment
6. Check webhook logs in Stripe dashboard

## API Endpoints

### Create Payment Intent
- **POST** `/api/payments/create-intent`
- **Body**: 
  ```json
  {
    "cartIds": ["cart-id-1", "cart-id-2"],
    "billingDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "streetAddress": "123 Main St",
      "city": "Toronto",
      "state": "Ontario",
      "postcode": "M5H 2N2",
      "country": "Canada"
    }
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "clientSecret": "pi_xxx_secret_xxx",
      "orderId": "order-id",
      "paymentId": "payment-id"
    }
  }
  ```

### Webhook Handler
- **POST** `/api/payments/webhook`
- Handles Stripe webhook events automatically
- Updates order and payment status in database

## Features Implemented

✅ Stripe Payment Intent creation
✅ Stripe Elements integration for card input
✅ Order creation in database
✅ Payment tracking
✅ Webhook handler for payment events
✅ Success/Failure pages
✅ Cart clearing after successful payment
✅ Order status management

## Notes

- The integration uses Stripe's Payment Intents API
- Payments are processed securely on Stripe's servers
- Card details never touch your server
- Webhooks ensure order status is updated even if user closes browser
- All sensitive operations require user authentication

