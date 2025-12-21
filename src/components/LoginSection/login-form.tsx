'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import FormInput from '@/components/shared/FormInput';
import Label from '@/components/shared/Label';
import { useLoginMutation } from '@/store/services/authApi';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '@/store/slices/authSlice';
import Loader from '@/components/shared/Loader';
import { useRouter } from 'next/navigation';

interface LoginFormProps extends React.ComponentProps<'div'> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);
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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="bg-white border border-borderBg shadow-sm rounded-lg">
        {/* Card Header */}
        <div className="p-6 border-b border-borderBg">
          <h2 className="text-2xl font-bold text-primaryText mb-2">
            Login to your account
          </h2>
          <p className="text-sm text-primaryText opacity-70">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="text-sm text-primaryColor underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
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

              {/* Submit Button */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || isRedirecting}
                  className="w-full px-4 py-3 bg-primaryColor text-white font-bold cursor-pointer rounded-md hover:opacity-90 transition-opacity disabled:opacity-50  disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(isLoading || isRedirecting) && <Loader size="sm" />}
                  {isLoading ? 'Logging in...' : isRedirecting ? 'Redirecting...' : 'Login'}
                </button>
                {/* <button
                  type="button"
                  className="w-full px-4 py-3 border border-borderBg bg-white text-primaryText font-bold rounded-md hover:bg-gray-50 transition-colors"
                >
                  Login with Google
                </button> */}
                <p className="text-sm text-center text-primaryText cursor-pointer opacity-70">
                  Don&apos;t have an account?{' '}
                  <a href="/register" className="text-primaryColor hover:underline">
                    Register
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

