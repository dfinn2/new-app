// components/ProductInfoPage.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Check, AlertTriangle } from 'lucide-react';
import AuthForm from './AuthForm';

interface ProductInfoPageProps {
  product: {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    stripePriceId?: string;
    stripeProductId?: string;
    slug: string;
  };
  isAuthenticated: boolean;
  user?: any; // User object from Supabase
  onContinue: () => void;
}

const ProductInfoPage: React.FC<ProductInfoPageProps> = ({
  product,
  isAuthenticated,
  user,
  onContinue,
}) => {
  return (
    <div className="space-y-8">
      {/* Product Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Legal Document
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-600 text-sm">
            Starting at ${product.basePrice?.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Authentication Section */}
      {!isAuthenticated ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Sign in to Continue</h2>
          </div>
          <p className="text-gray-600 mb-6">
            To create and customize your {product.name}, please sign in or create an account.
            This allows us to securely save your document and provide you with access to it in the future.
          </p>
          
          <AuthForm />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Check className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">
              {user?.user_metadata?.name ? `Welcome, ${user.user_metadata.name}` : "You're signed in"}
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            You're ready to proceed with creating your {product.name}. You'll be able to access this document
            in your dashboard after purchase.
          </p>
          <Button onClick={onContinue} className="w-full md:w-auto">
            Continue to Document Form
          </Button>
        </div>
      )}

      {/* Features and Benefits */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Features and Benefits</h2>
        <ul className="space-y-3">
          {product.slug === 'nnn-agreement-cn' && (
            <>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Comprehensive protection for your intellectual property in China</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Includes non-disclosure, non-use, and non-circumvention provisions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Customizable penalty clauses with options for liquidated damages</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Bilingual format with Chinese party details in both languages</span>
              </li>
            </>
          )}
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span>Drafted and reviewed by legal experts</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span>Instant download after purchase</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span>Secure PDF format with digital signature support</span>
          </li>
        </ul>
      </div>

      {/* Process */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">1</div>
            <h3 className="font-medium mb-2">Sign In & Customize</h3>
            <p className="text-sm text-gray-600">Fill out a simple form with your specific requirements</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">2</div>
            <h3 className="font-medium mb-2">Preview & Pay</h3>
            <p className="text-sm text-gray-600">Review your document and complete secure payment</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">3</div>
            <h3 className="font-medium mb-2">Download & Use</h3>
            <p className="text-sm text-gray-600">Get your document instantly and access it anytime</p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800 mb-2">Important Notice</h3>
            <p className="text-sm text-amber-700">
              This document is provided for general informational purposes only and does not constitute 
              legal advice. While we strive to provide accurate and up-to-date legal documents, laws and 
              regulations may change. We recommend consulting with a qualified attorney for specific 
              legal advice related to your situation.
            </p>
          </div>
        </div>
      </div>

      {/* CTA if not authenticated */}
      {!isAuthenticated && (
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            Already have an account?
          </p>
          <Button asChild variant="outline">
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductInfoPage;