// app/onboarding/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const setupProfile = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          setError('Authentication error. Please log in again.');
          router.push('/login');
          return;
        }
        
        const user = session.user;
        
        // Check if the user already has a profile
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
        
        if (existingProfile) {
          // Profile already exists, go to dashboard
          router.push('/dashboard');
          return;
        }
        
        // Create profile for new user
        const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            display_name: displayName,
            email: user.email,
          });
        
        if (insertError) {
          console.error('Profile creation error:', insertError);
          setError('Failed to create your profile. Please try again.');
          return;
        }
        
        // Success! Redirect to dashboard
        router.push('/dashboard');
        
      } catch (err) {
        console.error('Onboarding error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    setupProfile();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <h1 className="text-xl font-semibold">Setting up your account...</h1>
        <p className="mt-2 text-gray-600">This will only take a moment</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold">Account Setup Failed</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return null; // This shouldn't render as we redirect on success
}