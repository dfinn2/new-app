// app/login/actions.ts
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
    return { error: 'Please provide all required fields' }
  }

  // Sign up the user with Supabase Auth - JUST AUTHENTICATION
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

  // No profile creation here - just redirect to onboarding
  revalidatePath('/', 'layout')
  
  // Redirect to onboarding instead of dashboard
  redirect('/onboarding')
}

export async function login(formData: FormData) {
  // Keep original login code
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
  // Keep original Google auth code
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