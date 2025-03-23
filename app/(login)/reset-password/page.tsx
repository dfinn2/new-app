'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({
    type: null,
    text: ''
  });
  const [hasResetToken, setHasResetToken] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  const router = useRouter();
  const supabase = createClient();

  // Check if user has a valid reset token on component mount
  useEffect(() => {
    const checkSession = async () => {
      // Get URL hash (Supabase includes the token in the hash)
      if (typeof window !== 'undefined') {
        // Get recovery token from URL
        const hash = window.location.hash;
        const accessToken = hash.replace('#access_token=', '').split('&')[0];
        
        if (accessToken) {
          setHasResetToken(true);
        } else {
          setMessage({
            type: 'error',
            text: 'Invalid or expired password reset link. Please request a new one.'
          });
        }
      }
    };
    
    checkSession();
  }, []);

  // Countdown timer to redirect after successful password reset
  useEffect(() => {
    if (message.type === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (message.type === 'success' && countdown === 0) {
      router.push('/login');
    }
  }, [message.type, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      // Success message
      setMessage({ 
        type: 'success', 
        text: 'Your password has been successfully reset!' 
      });
      
      // Clear the password fields
      setPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage({ 
        type: 'error', 
        text: 'There was a problem resetting your password. Please try again or request a new reset link.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>
        
        {message.text && (
          <div className={`p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
            {message.type === 'success' && (
              <div className="mt-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-1 text-green-500" />
                <span>Redirecting to login in {countdown} seconds...</span>
              </div>
            )}
          </div>
        )}
        
        {hasResetToken ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="New password"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || message.type === 'success'}
              >
                {isLoading ? 'Resetting password...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-4 text-center">
            <Button asChild className="mt-4">
              <Link href="/forgot-password">
                Request New Reset Link
              </Link>
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}