// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Creating checkout session with data:", body);
    
    const { 
      productId, 
      productName, 
      price, 
      description, 
      stripePriceId, 
      stripeProductId,
      slug,
      email,
      formData
    } = body;
    
    // Extract relevant data from formData for metadata
    let metadata: Record<string, string> = {
      productId: productId || '',
      productName: productName || '',
    };
    
    // Add form data to metadata if available
    if (formData) {
      // Add specific fields we need for the purchase record
      metadata.documentType = productName || 'Legal Document';
      
      if (formData.disclosingPartyName) {
        metadata.disclosingParty = formData.disclosingPartyName;
      }
      
      if (formData.receivingPartyName) {
        metadata.receivingParty = formData.receivingPartyName;
      }
    }
    
    // Create session parameters
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/product/${slug || productId}`,
      metadata: metadata,
    };
    
    // Add customer email if provided
    if (email) {
      params.customer_email = email;
    }
    
    // If stripePriceId exists, use it directly
    if (stripePriceId) {
      params.line_items = [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ];
    }
    // If stripeProductId exists, find its first price
    else if (stripeProductId) {
      // Get the first active price for this product
      const prices = await stripe.prices.list({
        product: stripeProductId,
        active: true,
        limit: 1,
      });
      
      if (prices.data.length === 0) {
        return NextResponse.json(
          { error: "No active price found for this product" },
          { status: 400 }
        );
      }
      
      params.line_items = [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ];
    }
    // Otherwise create a product and price on the fly
    else {
      params.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: description || undefined,
              metadata: {
                product_id: productId,
              },
            },
            unit_amount: price, // Price should be in cents
          },
          quantity: 1,
        },
      ];
    }
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(params);
    
    // Return the session ID and URL
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error: unknown) {
    // Detailed error logging
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

{/* import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    // Log incoming request for debugging
    console.log("Creating checkout session...");
    
    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);
    
    const { 
      productId, 
      productName, 
      price, 
      description, 
      stripePriceId, 
      stripeProductId,
      slug,
      email 
    } = body;
    
    // Create session parameters
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/product/${slug || productId}`,
    };
    
    // Add customer email if provided
    if (email) {
      console.log("Setting customer email:", email);
      params.customer_email = email;
    }
    
    // If stripePriceId exists, use it directly
    if (stripePriceId) {
      console.log("Using Stripe Price ID:", stripePriceId);
      params.line_items = [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ];
    }
    // If stripeProductId exists, find its first price
    else if (stripeProductId) {
      console.log("Using Stripe Product ID:", stripeProductId);
      // Get the first active price for this product
      const prices = await stripe.prices.list({
        product: stripeProductId,
        active: true,
        limit: 1,
      });
      
      if (prices.data.length === 0) {
        return NextResponse.json(
          { error: "No active price found for this product" },
          { status: 400 }
        );
      }
      
      params.line_items = [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ];
    }
    // Otherwise create a product and price on the fly
    else {
      console.log("Creating one-time product:", productName);
      params.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: description || undefined,
              metadata: {
                product_id: productId,
              },
            },
            unit_amount: price, // Price should be in cents
          },
          quantity: 1,
        },
      ];
    }
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(params);
    console.log("Session created:", session.id);
    
    // Return the session ID and URL
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error: unknown) {
    // Detailed error logging
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorStack
      },
      { status: 500 }
    );
  }
}

*/}