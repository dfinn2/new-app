'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import  getStripe  from '@/lib/stripe';
import { Button } from '@/components/ui/button'; // Assuming you have this UI component

export default function SimpleStripeButton({ productName = "Standard Package", amount = 2500 }) {
  const [showPayment, setShowPayment] = useState(false);
  
  return (
    <div className="max-w-md mx-auto">
      {!showPayment ? (
        <Button 
          onClick={() => setShowPayment(true)} 
          className="w-full py-3 text-lg"
        >
          Buy Now - ${(amount/100).toFixed(2)}
        </Button>
      ) : (
        <Elements stripe={getStripe()}>
          <CheckoutForm 
            amount={amount} 
            productName={productName} 
            onCancel={() => setShowPayment(false)} 
          />
        </Elements>
      )}
    </div>
  );
}

function CheckoutForm({ amount, productName, onCancel }: {
  amount: number;
  productName: string;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    try {
      // Create payment intent on the server
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, productName }),
      });
      
      const { clientSecret } = await response.json();
      
      // Complete payment when customer submits the form
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        setError('Card element not found');
        setLoading(false);
        return;
      }
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card: cardElement,
          billing_details: {
            name: 'Test Customer',
          }
        }
      });
      
      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Complete Your Purchase</h3>
      
      {succeeded ? (
        <div className="text-center p-4">
          <p className="text-green-600 font-bold">Payment successful!</p>
          <p>Thank you for your purchase.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                }
              }
            }} />
          </div>
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <Button 
            type="submit" 
            disabled={!stripe || loading} 
            className="w-full"
          >
            {loading ? 'Processing...' : `Pay $${(amount/100).toFixed(2)}`}
          </Button>
          
          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}