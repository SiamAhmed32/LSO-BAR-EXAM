'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import FormInput from '@/components/shared/FormInput';
import Label from '@/components/shared/Label';
import { useRegisterMutation, useSendOTPMutation } from '@/store/services/authApi';

interface RegisterFormProps extends React.ComponentProps<'div'> {
  className?: string;
}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await sendOTP({ email }).unwrap();
      toast.success(result.message || 'OTP sent to your email!');
      setStep('otp');
      setCountdown(60); // 60 seconds cooldown
    } catch (error: any) {
      console.error('Send OTP - Error:', error);
      toast.error(error?.data?.error || error?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    console.log('Register Form - Submitting:', { username, email, password, otp });

    try {
      const result = await register({ username, email, password, otp }).unwrap();
      console.log('Register Form - Success Response:', result);
      
      // Show success toast and redirect
      toast.success('Registration successful!');
      setTimeout(() => {
        // Redirect based on user role if available
        const redirectPath = result?.data?.user?.role === 'ADMIN' ? '/admin/dashboard' : '/user-account';
        router.push(redirectPath);
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error('Register Form - Error:', error);
      console.error('Register Form - Error Data:', error?.data);
      toast.error(error?.data?.error || error?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown} seconds before requesting a new OTP`);
      return;
    }

    try {
      const result = await sendOTP({ email }).unwrap();
      toast.success(result.message || 'OTP resent to your email!');
      setCountdown(60); // Reset countdown
    } catch (error: any) {
      console.error('Resend OTP - Error:', error);
      toast.error(error?.data?.error || error?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleBackToForm = () => {
    setStep('form');
    setOtp('');
    setCountdown(0);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="bg-white border border-borderBg shadow-sm rounded-lg">
        {/* Card Header */}
        <div className="p-6 border-b border-borderBg">
          <h2 className="text-2xl font-bold text-primaryText mb-2">
            {step === 'form' ? 'Create your account' : 'Verify your email'}
          </h2>
          <p className="text-sm text-primaryText opacity-70">
            {step === 'form' 
              ? 'Enter your information below to create your account'
              : `We've sent a 6-digit code to ${email}`
            }
          </p>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSendOTP}>
              <div className="flex flex-col gap-6">
                {/* Username Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Username</Label>
                  <FormInput
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <FormInput
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primaryText hover:text-primaryColor transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <FormInput
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      required
                      className={`pr-10 ${passwordError ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primaryText hover:text-primaryColor transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={!!passwordError || isSendingOTP}
                    className="w-full px-4 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingOTP ? 'Sending OTP...' : 'Send Verification Code'}
                  </button>
                  <p className="text-sm text-center text-primaryText opacity-70">
                    Already have an account?{' '}
                    <a href="/login" className="text-primaryColor hover:underline">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-6">
                {/* OTP Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <FormInput
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                    required
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-primaryText opacity-60">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Resend OTP */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleBackToForm}
                    className="text-primaryColor hover:underline"
                  >
                    ← Change email
                  </button>
                  {countdown > 0 ? (
                    <span className="text-primaryText opacity-60">
                      Resend code in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-primaryColor hover:underline"
                    >
                      Resend code
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isRegistering || otp.length !== 6}
                    className="w-full px-4 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegistering ? 'Registering...' : 'Verify & Register'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
