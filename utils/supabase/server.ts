import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        getAll() {
          const allCookies = cookieStore.getAll()
          return allCookies.map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
            console.warn('Warning: Failed to set cookie in Server Component', name, error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            // The `remove` method was called from a Server Component.
            console.warn('Warning: Failed to remove cookie in Server Component', name, error)
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            console.warn('Warning: Failed to set cookies in Server Component', error)
          }
        },
      },
      cookieOptions: {
        // Ensure secure cookies in production
        secure: process.env.NODE_ENV === 'production',
        // Set session to expire after 7 days (or adjust as needed)
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        path: '/',
      },
    }
  )
}

// Helper function to handle profile creation after signup
export async function createUserProfile(userId: string, userData: any) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('user_profiles')
    .insert([
      {
        id: userId,
        email: userData.email,
               // Add other profile fields as needed
      }
    ])
  
  return { error }
}