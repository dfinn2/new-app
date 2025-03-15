'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface OrderDetails {
  confirmed: boolean;
  sessionId: string | null;
  status: string;
  customer?: {
    name: string;
    email: string;
  };
  items?: {
    name: string;
    quantity: number;
    amount: number;
  }[];
  payment: {
    amount: number;
    created: string;
  };
  receiptId: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getOrderDetails = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        
        // Call your verification API endpoint
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }
        
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error('Error fetching session details:', error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };
    
    getOrderDetails();
  }, [sessionId]);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been confirmed and you receive a confirmation email shortly.
        </p>
        
        {sessionId && (
          <div className="bg-gray-50 p-4 rounded mb-8 text-left">
            <p className="text-sm text-gray-500 mb-1">Order Reference:</p>
            <p className="font-mono text-sm">{sessionId}</p>
            <p className="text-sm text-gray-500 mt-4 mb-1">
              {orderDetails && `Order Status: ${orderDetails.confirmed ? 'Confirmed' : 'Pending'}`}
            </p>
          </div>
        )}
        
        {sessionId && orderDetails && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {/* Payment Status */}
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  orderDetails.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {orderDetails.status === 'paid' ? 'Paid' : 'Processing'}
                </span>
              </div>
              
              {/* Customer Info */}
              {orderDetails.customer && (
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500 mb-1">Customer:</p>
                  <p className="font-medium">{orderDetails.customer.name}</p>
                  <p className="text-gray-600">{orderDetails.customer.email}</p>
                </div>
              )}
              
              {/* Order Items */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500 mb-2">Items:</p>
                  {orderDetails.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{item.name} {item.quantity > 1 && `(${item.quantity})`}</span>
                      <span className="font-medium">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total */}
              <div className="flex justify-between pt-2 font-bold">
                <span>Total:</span>
                <span>${orderDetails.payment.amount.toFixed(2)}</span>
              </div>
              
              {/* Receipt ID */}
              <div className="mt-4 pt-4 border-t text-sm">
                <p className="text-gray-500">Receipt ID:</p>
                <p className="font-mono">{orderDetails.receiptId}</p>
                <p className="text-gray-500 mt-2">Date:</p>
                <p>{new Date(orderDetails.payment.created).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/products">
              Browse More Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}