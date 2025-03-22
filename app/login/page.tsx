'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login, signup, signInWithGoogle } from './actions'
import { User, Lock, Mail, UserPlus, Github } from 'lucide-react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const showSignup = searchParams.get('signup') === 'true'
  const [isLogin, setIsLogin] = useState(!showSignup)
  const [errorMessage, setErrorMessage] = useState('')

  // Set form mode based on URL parameter when component mounts
  useEffect(() => {
    setIsLogin(!showSignup)
  }, [showSignup])

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData)
    if (result?.error) {
      setErrorMessage(result.error)
    }
  }

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData)
    if (result?.error) {
      setErrorMessage(result.error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="ml-1 font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          action={isLogin ? handleLogin : handleSignup}
        >
          {!isLogin && (
            <div className="rounded-md shadow-sm">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="rounded-md shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLogin ? (
                  <Lock className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                ) : (
                  <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                )}
              </span>
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0001 4.37669C13.4677 4.37669 14.787 4.93254 15.8105 5.83697L19.0538 2.59523C17.0699 0.985304 14.6755 0 12.0001 0C7.3743 0 3.39207 2.59099 1.35626 6.43766L5.04855 9.34226C6.06159 6.47333 8.77431 4.37669 12.0001 4.37669Z" fill="#EA4335"/>
                <path d="M23.49 12.275C23.49 11.4917 23.4153 10.7333 23.28 10H12V14.5H18.4625C18.12 16.025 17.2667 17.3083 16.0217 18.1917L19.5567 21.1958C21.7683 19.1292 23.49 16.0042 23.49 12.275Z" fill="#4285F4"/>
                <path d="M5.04866 14.6578C4.81149 13.8317 4.67866 12.9317 4.67866 12C4.67866 11.0683 4.81149 10.1683 5.04866 9.34224L1.35638 6.43765C0.490661 8.09015 0 9.98515 0 12C0 14.0148 0.490661 15.9098 1.35638 17.5623L5.04866 14.6578Z" fill="#FBBC05"/>
                <path d="M12.0001 24.0001C14.6755 24.0001 16.9615 22.9468 18.6008 21.3001L15.0658 18.296C14.1099 18.9652 13.1015 19.125 12.0001 19.125C8.77431 19.125 6.06159 17.0284 5.04855 14.1595L1.35626 17.064C3.39207 20.9107 7.3743 24.0001 12.0001 24.0001Z" fill="#34A853"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>
            
            {/* Facebook OAuth placeholder for future implementation */}
            {/* 
            <button
              type="button"
              onClick={() => signInWithFacebook()}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              <span className="ml-2">Facebook</span>
            </button>
            */}
            
            <button
              type="button"
              onClick={() => { alert('GitHub login not implemented yet') }}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <Github className="w-5 h-5" />
              <span className="ml-2">GitHub</span>
            </button>
          </div>
        </div>

        <div className="text-center text-sm mt-6">
          <p className="text-gray-600">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}