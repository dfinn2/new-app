// utils/auth.ts
import { createClient } from '@/utils/supabase/server';

/**
 * Server-side function to check if a user is authenticated
 */
export async function isAuthenticated() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Server-side function to get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Server-side function to check if the user has completed onboarding
 */
export async function hasCompletedOnboarding() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return false;
    }
    
    // Check if user has a profile in the database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Client-side function to determine the redirect URL after login
 */
export function getRedirectUrl(currentPath: string) {
  // If the user was trying to access a specific page, redirect them back there
  if (currentPath && !currentPath.includes('/login') && !currentPath.includes('/signup')) {
    return currentPath;
  }
  
  // Otherwise, redirect to dashboard
  return '/dashboard';
}