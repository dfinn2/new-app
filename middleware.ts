import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/profile/:path*',
    '/private/:path*',
    
    // API routes that require authentication
    '/api/documents/:path*',
    '/api/generate-pdf',
    '/api/save-document',
    
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes that don't require authentication
     * - Public pages
     */
  ],
}