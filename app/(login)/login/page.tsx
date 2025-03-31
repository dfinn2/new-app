'use client'

import { useSearchParams } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo')
  const showSignup = searchParams.get('signup') === 'true'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Sign in or create an account to continue
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            CNIPApro is a platform for creating and managing legal documents.
          </p>
        </div>

        {/* Use the AuthForm component */}
        <AuthForm 
          initialMode={showSignup ? 'signup' : 'login'}
          returnToUrl={returnTo || undefined}
        />

        <div className="text-center text-sm mt-6">
          <p className="text-gray-600">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}