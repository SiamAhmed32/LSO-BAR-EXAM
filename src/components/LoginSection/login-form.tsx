'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import FormInput from '@/components/shared/FormInput';
import Label from '@/components/shared/Label';
import { useLoginMutation } from '@/store/services/authApi';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '@/store/slices/authSlice';
import Loader from '@/components/shared/Loader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ForgotPasswordModal from './ForgotPasswordModal';

interface LoginFormProps extends React.ComponentProps<'div'> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login Form - Submitting:', { email, password });

    try {
      const result = await login({ email, password }).unwrap();
      console.log('Login Form - Success Response:', result);
      
      // Handle session-based auth (Next.js API uses cookies, not tokens)
      if (result.success) {
        // For session-based auth, we don't need to store a token
        // The session cookie is automatically set by the API
        console.log('Login Form - Login successful, redirecting...');
        toast.success('Login successful!');
        setIsRedirecting(true);

        // Redirect based on user role
        const redirectPath = result.role === 'ADMIN' ? '/admin/dashboard' : '/user-account';
        // Use router.push with refresh to ensure fresh server data
        router.push(redirectPath);
        router.refresh();
      } else if (result.token) {
        // Fallback: if token is provided, use token-based auth
        dispatch(loginAction({ token: result.token, refreshToken: result.refreshToken }));
        console.log('Login Form - Token stored in Redux and localStorage');
        toast.success('Login successful!');
        setIsRedirecting(true);

        // Redirect based on user role
        const redirectPath = result.role === 'ADMIN' ? '/admin/dashboard' : '/user-account';
        // Use router.push with refresh to ensure fresh server data
        router.push(redirectPath);
        router.refresh();
      }
    } catch (error: any) {
      console.error('Login Form - Error:', error);
      console.error('Login Form - Error Data:', error?.data);
      toast.error(error?.data?.error || error?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <div className="bg-primaryCard border border-borderBg shadow-lg rounded-xl overflow-hidden">
          {/* Card Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="p-6 sm:p-8 border-b border-borderBg bg-gradient-to-r from-primaryColor/5 to-transparent"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primaryColor/10 rounded-lg">
                <LogIn className="w-5 h-5 sm:w-6 sm:h-6 text-primaryColor" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primaryText">
                Welcome Back
              </h2>
            </div>
            <p className="text-sm sm:text-base text-primaryText/70">
              Sign in to continue your exam preparation journey
            </p>
          </motion.div>

          {/* Card Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5 sm:gap-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-secColor" />
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-sm text-primaryColor hover:text-buttonHover underline-offset-4 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <FormInput
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="flex flex-col gap-4 pt-2"
                >
                  <motion.button
                    type="submit"
                    disabled={isLoading || isRedirecting}
                    whileHover={{ scale: isLoading || isRedirecting ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading || isRedirecting ? 1 : 0.98 }}
                    className="w-full px-4 py-3 sm:py-3.5 bg-primaryColor text-white font-bold cursor-pointer rounded-lg hover:bg-buttonHover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {(isLoading || isRedirecting) && <Loader size="sm" />}
                    {isLoading ? 'Logging in...' : isRedirecting ? 'Redirecting...' : 'Sign In'}
                  </motion.button>
                  <p className="text-sm text-center text-primaryText/70">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/register"
                      className="text-primaryColor font-semibold hover:text-buttonHover underline-offset-4 hover:underline transition-colors"
                    >
                      Create an account
                    </Link>
                  </p>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </>
  );
}
