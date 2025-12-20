"use client";

import React, { useState, useEffect, useMemo } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import FormInput from "../shared/FormInput";
import Label from "../shared/Label";
import { CreditCard, Calendar } from "lucide-react";
import Loader from "../shared/Loader";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { resetCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { cartApi } from "@/lib/api/cartApi";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutFormProps {
  onPaymentSuccess?: (orderId: string) => void;
}

const CheckoutFormContent = ({ onPaymentSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const subTotal = useSelector((state: RootState) => state.cart.subTotal);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    country: "Canada",
    city: "",
    state: "Ontario",
    postcode: "",
    email: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Fetch user's carts from backend to get cart IDs
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            const ids = data.data.map((cart: any) => cart.id);
            setCartIds(ids);
          }
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };

    fetchCarts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const countries = [
    { _id: "canada", name: "Canada" },
    { _id: "usa", name: "United States" },
  ];

  const canadianProvinces = [
    { _id: "ontario", name: "Ontario" },
    { _id: "quebec", name: "Quebec" },
    { _id: "british-columbia", name: "British Columbia" },
    { _id: "alberta", name: "Alberta" },
    { _id: "manitoba", name: "Manitoba" },
    { _id: "saskatchewan", name: "Saskatchewan" },
    { _id: "nova-scotia", name: "Nova Scotia" },
    { _id: "new-brunswick", name: "New Brunswick" },
    { _id: "newfoundland", name: "Newfoundland and Labrador" },
    { _id: "prince-edward", name: "Prince Edward Island" },
    { _id: "northwest", name: "Northwest Territories" },
    { _id: "yukon", name: "Yukon" },
    { _id: "nunavut", name: "Nunavut" },
  ];

  // Create payment intent when form is ready
  const createPaymentIntent = async () => {
    if (cartIds.length === 0) {
      toast.error("Your cart is empty");
      return null;
    }

    // Validate required billing fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.streetAddress || !formData.city || !formData.state || !formData.postcode) {
      toast.error("Please fill in all required billing details");
      return null;
    }

    setIsLoadingIntent(true);
    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartIds,
          billingDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            streetAddress: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      setClientSecret(data.data.clientSecret);
      setOrderId(data.data.orderId);
      return data.data;
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      toast.error(error.message || "Failed to initialize payment");
      return null;
    } finally {
      setIsLoadingIntent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded. Please refresh the page.");
      console.error("Stripe not initialized:", { stripe: !!stripe, elements: !!elements });
      return;
    }

    // Validate billing details
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.streetAddress || !formData.city || !formData.state || !formData.postcode) {
      toast.error("Please fill in all required billing details");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create payment intent if not already created
      let paymentData = null;
      let secretToUse = clientSecret;
      let finalOrderId = orderId;
      
      if (!clientSecret) {
        paymentData = await createPaymentIntent();
        if (!paymentData || !paymentData.clientSecret) {
          setIsSubmitting(false);
          return;
        }
        secretToUse = paymentData.clientSecret;
        finalOrderId = paymentData.orderId;
        // Save to state for potential retry
        setClientSecret(paymentData.clientSecret);
        setOrderId(paymentData.orderId);
      }

      if (!secretToUse) {
        toast.error("Payment intent not initialized");
        setIsSubmitting(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("Card element not found");
        setIsSubmitting(false);
        return;
      }

      // Confirm payment with Stripe
      console.log("Confirming payment with clientSecret:", secretToUse?.substring(0, 20) + "...");
      
      try {
        const result = await stripe.confirmCardPayment(
          secretToUse,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                address: {
                  line1: formData.streetAddress,
                  line2: formData.apartment || undefined,
                  city: formData.city,
                  state: formData.state,
                  postal_code: formData.postcode,
                  country: formData.country === "Canada" ? "CA" : "US",
                },
              },
            },
          }
        );

        console.log("Payment confirmation result:", {
          error: result.error,
          paymentIntent: result.paymentIntent ? {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            amount: result.paymentIntent.amount,
            last_payment_error: result.paymentIntent.last_payment_error,
          } : null,
        });

        if (result.error) {
          console.error("Payment confirmation error:", result.error);
          console.error("Error details:", {
            type: result.error.type,
            code: result.error.code,
            message: result.error.message,
            decline_code: result.error.decline_code,
            payment_intent: result.error.payment_intent,
          });
          toast.error(result.error.message || "Payment failed");
          router.push("/checkout/failure");
          setIsSubmitting(false);
          return;
        }

        // Check payment intent status
        if (result.paymentIntent) {
          const status = result.paymentIntent.status;
          console.log("Payment Intent Status:", status);

          if (status === "succeeded") {
            // Update order status immediately (webhook will also update, but this ensures it's updated right away)
            if (finalOrderId) {
              try {
                await fetch(`/api/orders/${finalOrderId}/update-status`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    status: "COMPLETED",
                    paymentStatus: "SUCCEEDED",
                  }),
                });
              } catch (error) {
                console.error("Failed to update order status:", error);
                // Don't block the success flow if this fails - webhook will handle it
              }
            }

            // Clear cart on frontend
            dispatch(resetCart());
            
            toast.success("Payment successful!");
            
            if (onPaymentSuccess && finalOrderId) {
              onPaymentSuccess(finalOrderId);
            } else {
              router.push(`/checkout/success?orderId=${finalOrderId || ""}`);
            }
          } else if (status === "requires_action") {
            // Handle 3D Secure or other actions
            // Stripe.js will automatically handle the redirect
            toast.info("Please complete the authentication in the popup window.");
            // The payment will complete after authentication
            // We'll wait for webhook to update the status
            router.push(`/checkout/success?orderId=${finalOrderId || ""}&pending=true`);
          } else if (status === "processing") {
            // Payment is processing
            toast.info("Your payment is being processed. Please wait...");
            router.push(`/checkout/success?orderId=${finalOrderId || ""}&processing=true`);
          } else if (status === "requires_payment_method") {
            console.error("Payment requires payment method - card may have been declined");
            toast.error("Payment method was declined. Please try a different card.");
            router.push("/checkout/failure");
          } else if (status === "requires_confirmation") {
            console.error("Payment requires confirmation");
            toast.error("Payment requires additional confirmation. Please try again.");
            router.push("/checkout/failure");
          } else {
            console.error("Unexpected payment intent status:", status);
            toast.error(`Payment status: ${status}. Please contact support.`);
            router.push("/checkout/failure");
          }
        } else {
          console.error("No payment intent in result:", result);
          toast.error("Payment confirmation failed - no payment intent returned");
          router.push("/checkout/failure");
        }
      } catch (confirmError: any) {
        console.error("Exception during payment confirmation:", confirmError);
        toast.error(confirmError.message || "An error occurred during payment confirmation");
        router.push("/checkout/failure");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An error occurred during checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Billing Details Section */}
      <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 border-b border-borderBg">
          <h2 className="text-xl sm:text-2xl font-bold text-primaryText">
            Billing details
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">
                First name <span className="text-red-500">*</span>
              </Label>
              <FormInput
                id="firstName"
                name="firstName"
                type="text"
                placeholder=""
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">
                Last name <span className="text-red-500">*</span>
              </Label>
              <FormInput
                id="lastName"
                name="lastName"
                type="text"
                placeholder=""
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="streetAddress">
              Street address <span className="text-red-500">*</span>
            </Label>
            <FormInput
              id="streetAddress"
              name="streetAddress"
              type="text"
              placeholder="House number and street name"
              value={formData.streetAddress}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="apartment"
              name="apartment"
              type="text"
              placeholder="Apartment, suite, unit, etc. (optional)"
              value={formData.apartment}
              onChange={handleInputChange}
            />
          </div>

          {/* Country / Region */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="country">
              Country / Region <span className="text-red-500">*</span>
            </Label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="border border-borderBg rounded-none focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor px-4 py-3 w-full text-foreground hover:border-primaryColor transition-colors"
            >
              {countries.map((country) => (
                <option key={country._id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Town / City & State / County */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">
                Town / City <span className="text-red-500">*</span>
              </Label>
              <FormInput
                id="city"
                name="city"
                type="text"
                placeholder=""
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">
                State / County <span className="text-red-500">*</span>
              </Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="border border-borderBg rounded-none focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor px-4 py-3 w-full text-foreground hover:border-primaryColor transition-colors"
              >
                {canadianProvinces.map((province) => (
                  <option key={province._id} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Postcode / ZIP */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="postcode">
              Postcode / ZIP <span className="text-red-500">*</span>
            </Label>
            <FormInput
              id="postcode"
              name="postcode"
              type="text"
              placeholder=""
              value={formData.postcode}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <FormInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </div>

      {/* Payment Section */}
      <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 border-b border-borderBg">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primaryText" />
            <h2 className="text-xl sm:text-2xl font-bold text-primaryText">
              Credit / Debit Card
            </h2>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {/* Stripe Card Element */}
          <div className="border border-borderBg rounded-lg p-4">
            <Label>Card Details</Label>
            <div className="mt-2 p-3 border border-borderBg rounded">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm p-4 sm:p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 w-4 h-4 text-primaryColor focus:ring-primaryColor border-borderBg rounded"
          />
          <span className="text-sm text-primaryText">
            I understand and accept that all of LSO Bar Prep&apos;s paid
            products can be attempted two times. I confirm and accept that I have read{" "}
            <a
              href="#"
              className="text-primaryColor underline hover:opacity-80"
            >
              LSO Bar Prep&apos;s Terms and Conditions
            </a>
            .
          </span>
        </label>
      </div>

      {/* Place Order Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!acceptTerms || isSubmitting || isLoadingIntent || !stripe}
          className="w-full sm:w-auto px-8 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {(isSubmitting || isLoadingIntent) && <Loader size="sm" />}
          {isLoadingIntent
            ? "Initializing..."
            : isSubmitting
            ? "Processing..."
            : "Place Order"}
        </button>
      </div>
    </div>
  );
};

const CheckoutForm = ({ onPaymentSuccess }: CheckoutFormProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // For Payment Intents, we don't need mode/currency in options
  // The amount comes from the Payment Intent created on the backend
  const options: StripeElementsOptions = {
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutFormContent onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
};

export default CheckoutForm;
