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
        
        // Check for saved return path FIRST - before any other logic
        const savedReturnPath = localStorage.getItem('authReturnPath');
           
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
          // Profile exists - this is likely a sign-in
          console.log('Existing profile found, redirecting to:', savedReturnPath || '/dashboard');
          if (savedReturnPath && savedReturnPath.startsWith('/product/')) {
            localStorage.removeItem('authReturnPath'); // Clear after use
            router.push(savedReturnPath);
          } else {
            router.push('/dashboard'); 
          }
          return;
        }
        
        // This is a new user - create profile
        const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        
        console.log('Creating new profile for user:', user.id);
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
        
        console.log('Profile created successfully');
        
        // After profile creation, check for saved path again
        console.log('After profile creation, redirecting to:', savedReturnPath || '/dashboard');
        if (savedReturnPath && savedReturnPath.startsWith('/product/')) {
          localStorage.removeItem('authReturnPath'); // Clear after use
          router.push(savedReturnPath);
        } else {
          router.push('/dashboard');
        }
        
      } catch (err) {
        console.error('Onboarding error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    setupProfile();
  }, [router]);
  
  // Your loading and error UI...
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (error) {
    return <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-red-600">Error</h2>
      <p className="mt-2">{error}</p>
      <button 
        onClick={() => router.push('/login')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return to Login
      </button>
    </div>;
  }
  
  return null; // This page should always redirect
}