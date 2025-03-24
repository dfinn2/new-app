"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserLocation } from "@/lib/location";

interface BuyNowButtonProps {
  productId: string;
  productName: string;
  price: number; // Price in dollars (will be converted to cents for Stripe)
  slug: string;
  stripePriceId?: string;
  stripeProductId?: string;
  description?: string;
}

interface CheckoutResponse {
  sessionId: string;
  url: string;
  error?: string;
}

export default function BuyNowButton({
  productId,
  productName,
  price,
  slug,
  stripePriceId,
  stripeProductId,
  description = "",
}: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { location } = useUserLocation();

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get form data from localStorage if available
      const formDataString = localStorage.getItem("nnnAgreementFormData");
      const formData = formDataString ? JSON.parse(formDataString) : null;

      console.log("Creating checkout for:", {
        productName,
        price,
        stripePriceId,
        stripeProductId,
      });

      // Create checkout session on the server
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          price: Math.round(price * 100), // Convert to cents
          description,
          stripePriceId, // Pass the Stripe Price ID if available
          stripeProductId, // Pass the Stripe Product ID if available
          slug, // Add slug for cancel URL
          // Add email if available for receipt email
          email: formData?.email || "",
        }),
      });

      const responseText = await response.text();

      // Try to parse as JSON, but keep text if it fails
      let data: CheckoutResponse;
      try {
        data = JSON.parse(responseText);
      } catch (e: unknown) {
        // Use the error variable by including it in the error message
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(
          `Server returned invalid JSON: ${errorMessage} (Raw: ${responseText})`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: unknown) {
      console.error("Error creating checkout session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process payment"
      );
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 p-2 rounded text-red-500 text-sm">
          {error}
        </div>
      )}
      <Button
        onClick={handleClick}
        disabled={loading}
        className="w-full px-8 py-3 text-lg"
      >
        {loading ? "Processing..." : `Buy Now - $${price.toFixed(2)}`}
      </Button>
    </div>
  );
}

/* FUTURE IMPROVEMENTS:
 * 1. Add error handling with a toast notification system
 * 2. Implement quantity selector for bulk purchases
 * 3. Add support for discount codes
 * 4. Create a mini-cart for multiple items
 * 5. Add analytics tracking for checkout button clicks
 */
