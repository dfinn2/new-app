'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  // Validate inputs
  if (!email || !password || !name) {
    // In a real app, you'd want to return an error to display to the user
    return { error: 'Please provide all required fields' }
  }

  // Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name // Store name in the auth metadata
      }
    }
  })

  if (authError) {
    console.error('Auth error:', authError)
    return { error: authError.message }
  }

  // If auth was successful, create a user profile record
  if (authData?.user) {
    const { error: profileError } = await supabase
      .from('user_profile')
      .insert({
        id: authData.user.id,
        display_name: name,
        email: email,
        created_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Consider whether to revert the auth signup if profile creation fails
      return { error: 'Account created but profile setup failed. Please contact support.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard') // Send them directly to dashboard after signup
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const cookieStore = cookies()
  const origin = cookieStore.get('next-url')?.value || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  
  if (error) {
    console.error('OAuth error:', error)
    return { error: error.message }
  }
  
  if (data?.url) {
    redirect(data.url)
  }
}

// Placeholder for Facebook OAuth integration
/*
export async function signInWithFacebook() {
  const supabase = await createClient()
  const cookieStore = cookies()
  const origin = cookieStore.get('next-url')?.value || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: 'email,public_profile',
    },
  })
  
  if (error) {
    console.error('OAuth error:', error)
    return { error: error.message }
  }
  
  if (data?.url) {
    redirect(data.url)
  }
}
*/