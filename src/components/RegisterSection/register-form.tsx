'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import FormInput from '@/components/shared/FormInput';
import Label from '@/components/shared/Label';
import { useRegisterMutation, useSendOTPMutation } from '@/store/services/authApi';
import Link from 'next/link';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="bg-primaryCard border border-borderBg shadow-lg rounded-xl overflow-hidden">
        {/* Card Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 border-b border-borderBg bg-gradient-to-r from-primaryColor/5 to-transparent"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primaryColor/10 rounded-lg">
                {step === 'form' ? (
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-primaryColor" />
                ) : (
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primaryColor" />
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primaryText">
                {step === 'form' ? 'Get Started' : 'Verify Your Email'}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-primaryText/70">
              {step === 'form' 
                ? 'Create your account to access practice exams and track your progress'
                : `We've sent a 6-digit verification code to ${email}`
              }
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Card Content */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOTP}
              >
                <div className="flex flex-col gap-5 sm:gap-6">
                  {/* Username Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-secColor" />
                      Username
                    </Label>
                    <FormInput
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primaryColor/20"
                    />
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-secColor" />
                      Email Address
                    </Label>
                    <FormInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primaryColor/20"
                    />
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-secColor" />
                      Password
                    </Label>
                    <div className="relative">
                      <FormInput
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        className="pr-10 transition-all focus:ring-2 focus:ring-primaryColor/20"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primaryText/60 hover:text-primaryColor transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-secColor" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <FormInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        required
                        className={`pr-10 transition-all focus:ring-2 focus:ring-primaryColor/20 ${passwordError ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primaryText/60 hover:text-primaryColor transition-colors"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 mt-1"
                      >
                        {passwordError}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex flex-col gap-4 pt-2"
                  >
                    <motion.button
                      type="submit"
                      disabled={!!passwordError || isSendingOTP}
                      whileHover={{ scale: !!passwordError || isSendingOTP ? 1 : 1.02 }}
                      whileTap={{ scale: !!passwordError || isSendingOTP ? 1 : 0.98 }}
                      className="w-full px-4 py-3 sm:py-3.5 bg-primaryColor text-white font-bold rounded-lg hover:bg-buttonHover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {isSendingOTP ? 'Sending Code...' : 'Send Verification Code'}
                    </motion.button>
                    <p className="text-sm text-center text-primaryText/70">
                      Already have an account?{' '}
                      <Link
                        href="/login"
                        className="text-primaryColor font-semibold hover:text-buttonHover underline-offset-4 hover:underline transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </motion.div>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
              >
                <div className="flex flex-col gap-5 sm:gap-6">
                  {/* OTP Field */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="otp" className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-secColor" />
                      Verification Code
                    </Label>
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
                      className="text-center text-2xl sm:text-3xl tracking-[0.5em] font-mono transition-all focus:ring-2 focus:ring-primaryColor/20"
                    />
                    <p className="text-xs sm:text-sm text-primaryText/60 mt-1">
                      Enter the 6-digit code sent to your email
                    </p>
                  </motion.div>

                  {/* Resend OTP */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <motion.button
                      type="button"
                      onClick={handleBackToForm}
                      whileHover={{ x: -2 }}
                      className="text-primaryColor hover:text-buttonHover underline-offset-4 hover:underline transition-colors flex items-center gap-1"
                    >
                      ← Change email
                    </motion.button>
                    {countdown > 0 ? (
                      <span className="text-primaryText/60">
                        Resend code in {countdown}s
                      </span>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={handleResendOTP}
                        whileHover={{ scale: 1.05 }}
                        className="text-primaryColor hover:text-buttonHover underline-offset-4 hover:underline transition-colors"
                      >
                        Resend code
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="pt-2"
                  >
                    <motion.button
                      type="submit"
                      disabled={isRegistering || otp.length !== 6}
                      whileHover={{ scale: isRegistering || otp.length !== 6 ? 1 : 1.02 }}
                      whileTap={{ scale: isRegistering || otp.length !== 6 ? 1 : 0.98 }}
                      className="w-full px-4 py-3 sm:py-3.5 bg-primaryColor text-white font-bold rounded-lg hover:bg-buttonHover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {isRegistering ? 'Registering...' : 'Verify & Register'}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
