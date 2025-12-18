"use client";

import React, { useState } from "react";
import FormInput from "../shared/FormInput";
import Label from "../shared/Label";
import { CreditCard, Calendar } from "lucide-react";

const CheckoutForm = () => {
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
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - no backend integration yet
    console.log("Form submitted:", formData);
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
              className="border border-borderBg rounded-none focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button px-4 py-3 w-full text-foreground"
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
                className="border border-borderBg rounded-none focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button px-4 py-3 w-full text-foreground"
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
          {/* Stripe Link Section - Placeholder */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-primaryText mb-1">
                  Secure, fast checkout with Link
                </h3>
                <p className="text-sm text-primaryText/70">
                  Securely pay with your saved info, or create a Link account
                  for faster checkout next time.
                </p>
              </div>
              <button
                type="button"
                className="text-primaryText/50 hover:text-primaryText"
                aria-label="Close"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              <a
                href="#"
                className="text-sm text-purple-600 hover:underline flex items-center gap-1"
              >
                link <span>→</span>
              </a>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cardNumber">Card number</Label>
              <div className="relative">
                <FormInput
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  placeholder="1234 1234 1234 1234"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-primaryText/70">
                    Visa
                  </span>
                  <span className="text-xs font-semibold text-primaryText/70">
                    MC
                  </span>
                  <span className="text-xs font-semibold text-primaryText/70">
                    Amex
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="expiryDate">Expiration date</Label>
                <div className="relative">
                  <FormInput
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primaryText/50" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cvc">Security code</Label>
                <div className="relative">
                  <FormInput
                    id="cvc"
                    name="cvc"
                    type="text"
                    placeholder="CVC"
                    value={formData.cvc}
                    onChange={handleInputChange}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-4 border border-borderBg rounded bg-white flex items-center justify-center">
                      <span className="text-[8px] text-primaryText/50">123</span>
                    </div>
                  </div>
                </div>
              </div>
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
            I understand and accept that all of Access Bar Prep&apos;s paid
            products are accessible for 90 days and can be attempted three
            times. I confirm and accept that I have read{" "}
            <a
              href="#"
              className="text-primaryColor underline hover:opacity-80"
            >
              Access Bar Prep&apos;s Terms and Conditions
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
          disabled={!acceptTerms}
          className="w-full sm:w-auto px-8 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;

