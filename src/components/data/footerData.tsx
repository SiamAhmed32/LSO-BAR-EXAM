'use client';

import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export const footerData = {
  companyInfo: {
    name: "RealTor",
    description: "Helping you find the perfect property for over 15 years. \nYour dream home is just a click away."
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Buy", href: "buy" },
        { label: "Rent", href: "rent" },
        { label: "All Properties", href: "all-properties" },
      ]
    },
  ],
  contactInfo: [
    {
      type: 'address',
      value: "House 88, 17/A\nBanani, Dhaka 1213",
      icon: MapPin
    },
    {
      type: 'phone',
      value: "(+880) 1828-398-225",
      href: "tel:+8801828398225",
      icon: Phone
    },
    {
      type: 'email',
      value: "info@thinkcrypt.io",
      href: "mailto:info@thinkcrypt.io",
      icon: Mail
    }
  ],
  socialLinks: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin }
  ],
  bottomLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" }
  ],
  copyright: "© 2025 MINT Homes. All rights reserved."
};
