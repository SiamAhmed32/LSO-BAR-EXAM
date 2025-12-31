'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import FormInput from '@/components/shared/FormInput';
import Label from '@/components/shared/Label';
import { useSendOTPMutation } from '@/store/services/authApi';
import Loader from '@/components/shared/Loader';
import { useResetPasswordMutation } from '@/store/services/authApi';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setCountdown(0);
    }
  }, [isOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    // Move to password reset step
    // OTP will be verified when user submits new password
    setStep('newPassword');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const result = await resetPassword({ email, otp, password: newPassword }).unwrap();
      toast.success(result.message || 'Password reset successfully!');
      onClose();
      // Optionally redirect to login
    } catch (error: any) {
      console.error('Reset Password - Error:', error);
      toast.error(error?.data?.error || error?.data?.message || 'Failed to reset password. Please try again.');
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

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-borderBg">
          <h2 className="text-2xl font-bold text-primaryText">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify Email'}
            {step === 'newPassword' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="text-primaryText hover:text-primaryColor transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 relative overflow-hidden">
          <div
            key={step}
            className="transition-all duration-300 ease-in-out"
            style={{
              animation: 'fadeInSlide 0.3s ease-in-out forwards'
            }}
          >
            {step === 'email' && (
              <form onSubmit={handleSendOTP}>
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-primaryText opacity-70">
                    Enter your email address and we'll send you a verification code to reset your password.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <FormInput
                      id="forgot-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSendingOTP}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-borderBg bg-white text-primaryText font-bold rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingOTP}
                      className="flex-1 px-4 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSendingOTP && <Loader size="sm" />}
                      {isSendingOTP ? 'Sending...' : 'Send Code'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP}>
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-primaryText opacity-70">
                    We've sent a 6-digit code to <strong>{email}</strong>. Please enter it below.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="forgot-otp">Verification Code</Label>
                    <FormInput
                      id="forgot-otp"
                      name="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      required
                      className="text-center text-2xl tracking-widest font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep('email')}
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
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-borderBg bg-white text-primaryText font-bold rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={otp.length !== 6}
                      className="flex-1 px-4 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 'newPassword' && (
              <form onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-primaryText opacity-70">
                    Enter your new password below.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <FormInput
                      id="new-password"
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <FormInput
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('otp')}
                      className="flex-1 px-4 py-3 border border-borderBg bg-white text-primaryText font-bold rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isResettingPassword || newPassword !== confirmPassword || newPassword.length < 6}
                      className="flex-1 px-4 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isResettingPassword && <Loader size="sm" />}
                      {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

