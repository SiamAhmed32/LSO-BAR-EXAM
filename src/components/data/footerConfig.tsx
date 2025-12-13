'use client';

import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export const footerData = {
  companyInfo: {
    name: "Your Company",
    description: "Your company description here."
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
      ]
    },
  ],
  contactInfo: [
    {
      type: 'address',
      value: "Your Address Here",
      icon: MapPin
    },
    {
      type: 'phone',
      value: "+1 (555) 000-0000",
      href: "tel:+15550000000",
      icon: Phone
    },
    {
      type: 'email',
      value: "contact@example.com",
      href: "mailto:contact@example.com",
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
  copyright: "© 2025 Your Company. All rights reserved."
};
