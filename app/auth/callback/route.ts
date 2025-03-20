import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if we're behind a load balancer (for production environments)
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // Local development - no load balancer
        return NextResponse.redirect(`${new URL(request.url).origin}${next}`)
      } else if (forwardedHost) {
        // Production with load balancer
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        // Fallback
        return NextResponse.redirect(`${new URL(request.url).origin}${next}`)
      }
    }
  }

  // If there's an error, redirect to login page
  return NextResponse.redirect(`${new URL(request.url).origin}/login?error=callback_error`)
}