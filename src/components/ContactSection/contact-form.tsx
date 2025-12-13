'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import FormInput from '@/components/shared/FormInput';
import FormTextarea from '@/components/shared/FormTextarea';
import Label from '@/components/shared/Label';
import ButtonPrimary from '@/components/shared/ButtonPrimary';
import Link from 'next/link';

interface ContactFormProps extends React.ComponentProps<'div'> {
  className?: string;
}

export function ContactForm({ className, ...props }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // const [isRobot, setIsRobot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission here
    console.log('Contact:', { name, email, message });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="bg-white border border-borderBg shadow-sm rounded-lg">
        {/* Card Content */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message</Label>
                <FormTextarea
                  id="message"
                  name="message"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              {/* reCAPTCHA */}
              {/* <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recaptcha"
                  checked={isRobot}
                  onChange={(e) => setIsRobot(e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="recaptcha" className="text-sm text-primaryText cursor-pointer">
                  I&apos;m not a robot
                </label>
              </div> */}

              {/* Submit Button */}
              <div className="pt-2">
                <ButtonPrimary
                  type="submit"
                  className="w-full bg-primaryColor text-white hover:opacity-90 border-0"
                >
                  Send
                </ButtonPrimary>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

