# Local Payment Testing Guide

## Common 500 Error Causes

### 1. Missing Environment Variables

Make sure you have these in your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Only needed for webhook testing
```

### 2. Database Not Migrated

Run this to update your database schema:

```bash
npx prisma db push
```

Or create a migration:

```bash
npx prisma migrate dev --name add_order_and_payment_models
```

### 3. Check Server Console

When you get a 500 error, check your terminal/console where you're running `npm run dev`. The error details will be logged there.

## Testing Locally

### Option 1: Use Stripe CLI (Recommended for Local Testing)

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

4. **Copy the webhook signing secret** shown in the terminal (starts with `whsec_`)

5. **Add it to your `.env.local`:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...  # The secret from step 4
   ```

6. **Test the payment:**
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code

### Option 2: Test Without Webhooks (Payment Intent Only)

If you just want to test the payment flow without webhooks:

1. Make sure you have `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
2. You don't need `STRIPE_WEBHOOK_SECRET` for basic testing
3. The payment will work, but order status won't update automatically via webhook

## Debugging Steps

1. **Check if Stripe keys are loaded:**
   - Add a console.log in your API route to verify
   - Make sure `.env.local` is in your project root
   - Restart your dev server after adding env vars

2. **Check database connection:**
   - Make sure your database is running
   - Check your `DATABASE_URL` in `.env.local`

3. **Check authentication:**
   - Make sure you're logged in
   - Check if session is valid

4. **Check cart data:**
   - Make sure you have items in your cart
   - Verify cart IDs are being sent correctly

## Common Error Messages

### "STRIPE_SECRET_KEY is not set"
- Add `STRIPE_SECRET_KEY` to `.env.local`
- Restart dev server

### "No carts found"
- Make sure you have items in your cart
- Check if cart IDs are being sent correctly

### "Exam does not have a price"
- Make sure the exam has a price set in the database
- Check exam settings in admin panel

### Database errors
- Run `npx prisma db push` to update schema
- Or `npx prisma migrate dev`

## Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, any postal code.

