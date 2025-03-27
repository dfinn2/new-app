// This is the Auth form imported into ProductClient and used in Form Pages

'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation'; // Add useSearchParams
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '';

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to onboarding with returnTo parameter
      if (returnTo) {
        router.push(`/onboarding?returnTo=${encodeURIComponent(returnTo)}`);
      } else {
        router.push('/onboarding');
      }
    } catch (error: Error | unknown) {
      console.error('Sign up error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please enter your email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Handle redirect after successful login
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push('/dashboard');
      }
    } catch (error: Error | unknown) {
      console.error('Sign in error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Store returnTo in localStorage before OAuth redirect
      if (returnTo) {
        localStorage.setItem('returnToUrl', returnTo);
      }
      
      // Include returnTo in the options.redirectTo URL
      const redirectUrl = new URL(`${window.location.origin}/auth/callback`);
      if (returnTo) {
        redirectUrl.searchParams.append('returnTo', returnTo);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl.toString()
        }
      });
      
      if (error) {
        throw error;
      }
      
      // The redirect will happen automatically
    } catch (error: Error | unknown) {
      console.error('Google sign in error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="mx-20 mb-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4 mx-20">
        {isSignUp && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        )}
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center "
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <div className="pt-4">
        <Button
          type="submit"
          className="w-full py-6"
          disabled={isLoading}
        >
          
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? 'Creating Account...' : 'Signing In...'}
            </>
          ) : (
            isSignUp ? 'Create Account' : 'Sign In'
          )}
        </Button>
        </div>
      </form>
      
      <div className="relative mt-6 mx-40">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-400"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-600">Or continue with</span>
        </div>
      </div>
      
      <div className="mt-6 mx-20">
        <Button
          variant="outline"
          className="w-full py-5"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </Button>
      </div>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={toggleMode}
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;