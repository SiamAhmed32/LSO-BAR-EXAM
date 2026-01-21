'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import FormInput from '@/components/shared/FormInput';
import FormTextarea from '@/components/shared/FormTextarea';
import Label from '@/components/shared/Label';
import ButtonPrimary from '@/components/shared/ButtonPrimary';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

interface ContactFormProps extends React.ComponentProps<'div'> {
  className?: string;
}

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface SubmitStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export function ContactForm({ className, ...props }: ContactFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<SubmitStatus>({
    type: 'idle',
    message: '',
  });

  const handleInputChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear status when user starts typing
    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    if (formData.name.trim().length < 3) {
      return 'Name must be at least 3 characters';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      return 'Message is required';
    }
    if (formData.message.trim().length < 10) {
      return 'Message must be at least 10 characters';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setStatus({
        type: 'error',
        message: validationError,
      });
      return;
    }

    // Set loading state
    setStatus({
      type: 'loading',
      message: 'Sending your message...',
    });

    // Console log for debugging - payload being sent
    const payload = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };
    console.log('📤 Contact Form - Submitting Payload:', payload);
    console.log('📊 Contact Form - Payload Details:', {
      name: formData.name,
      nameLength: formData.name.length,
      email: formData.email,
      messageLength: formData.message.length,
      messagePreview: formData.message.substring(0, 50) + (formData.message.length > 50 ? '...' : ''),
    });

    try {
      console.log('🌐 Contact Form - Sending request to /api/contact');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Contact Form - Response Status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📥 Contact Form - Response Data:', data);

      if (response.ok) {
        console.log('✅ Contact Form - Success!', {
          success: data.success,
          message: data.message,
          contactId: data.data?.contactInfo?.id,
          timestamp: data.data?.contactInfo?.createdAt,
        });
        
        setStatus({
          type: 'success',
          message: data.message || 'Your message has been sent successfully!',
        });
        
        // Show toast notification
        toast.success(data.message || 'Your message has been sent successfully!');
        
        // Reset form on success
        console.log('🔄 Contact Form - Resetting form');
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        console.error('❌ Contact Form - Error Response:', {
          status: response.status,
          error: data.error,
          message: data.message,
          details: data.details,
        });
        
        const errorMessage = data.message || data.error || 'Failed to send message. Please try again.';
        setStatus({
          type: 'error',
          message: errorMessage,
        });
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Contact Form - Network/Request Error:', error);
      console.error('❌ Contact Form - Error Details:', {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      const errorMessage = 'Network error. Please check your connection and try again.';
      setStatus({
        type: 'error',
        message: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  const renderStatusMessage = () => {
    if (status.type === 'idle') return null;

    const baseClasses = "flex items-center gap-2 p-3 rounded-lg text-sm font-medium";
    
    switch (status.type) {
      case 'loading':
        return (
          <div className={`${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`}>
            <Loader className="w-4 h-4 animate-spin" />
            {status.message}
          </div>
        );
      case 'success':
        return (
          <div className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}>
            <CheckCircle className="w-4 h-4" />
            {status.message}
          </div>
        );
      case 'error':
        return (
          <div className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}>
            <XCircle className="w-4 h-4" />
            {status.message}
          </div>
        );
      default:
        return null;
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="bg-white border border-borderBg shadow-sm rounded-lg">
        {/* Card Content */}
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
            <p className="text-gray-600">
              Have a question or need support? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Status Message */}
              {renderStatusMessage()}

              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  disabled={status.type === 'loading'}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address *</Label>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={status.type === 'loading'}
                  required
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message *</Label>
                <FormTextarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  rows={6}
                  disabled={status.type === 'loading'}
                  required
                />
                <p className="text-xs text-gray-500">
                  Minimum 10 characters required
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <ButtonPrimary
                  type="submit"
                  disabled={!isFormValid || status.type === 'loading'}
                  className={cn(
                    "w-full",
                    status.type === 'loading' && "opacity-75 cursor-not-allowed",
                    !isFormValid && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {status.type === 'loading' ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </ButtonPrimary>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  We'll respond within 24-48 hours.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
          <p className="text-sm text-gray-600">Ontario, Canada</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
          <p className="text-sm text-gray-600">lsobarexamteam@gmail.com</p>
        </div>

      </div>
    </div>
  );
}
